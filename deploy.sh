#!/usr/bin/env bash
# Déploiement de la production (app.addfrance.fr) depuis un poste de dev.
#
# Usage :
#   ./deploy.sh                    déploie origin/master
#   ./deploy.sh --rollback <sha>   revient au commit <sha> (affiché par le déploiement précédent)
#   MIGRATE=1 ./deploy.sh          joue aussi les migrations en attente
#
# Lancé aussi par GitHub Actions (.github/workflows/deploy.yml), qui fournit DEPLOY_HOST.
# Le code de production est un clone git monté dans les conteneurs (/app) :
# pull, build du front Vite dans le conteneur, redémarrage de l'app et de Sidekiq,
# puis contrôles. Le front précédent est sauvegardé à chaque déploiement.
# Les migrations sont signalées, et jouées seulement avec MIGRATE=1.
set -euo pipefail

HOST="${DEPLOY_HOST:-paul@178.170.15.102}"
APP_DIR="/home/web/funadf/production/funadf"
URL="https://app.addfrance.fr"
STAMP="$(date +%Y%m%d-%H%M%S)"

remote() { ssh -o BatchMode=yes -o ConnectTimeout=10 "$HOST" "$@"; }
step()   { printf '\n==> %s\n' "$*"; }

check() {
  step "Contrôles"
  local ok=1 code
  for path in /connexion /api/current_user; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$URL$path" || echo 000)"
    echo "$path -> $code"
    case "$path:$code" in
      /connexion:200 | /api/current_user:401) ;;
      *) ok=0 ;;
    esac
  done
  remote "docker ps --filter name=funadf_ --format '{{.Names}}\t{{.Status}}'"
  remote "docker logs --tail 15 funadf_app 2>&1" | sed 's/^/  app | /'
  [ "$ok" = 1 ]
}

restart() {
  step "Redémarrage de l'app et de Sidekiq"
  remote "docker restart funadf_app funadf_sidekiq >/dev/null"
  # Unicorn précharge l'app : on lui laisse le temps de démarrer
  for _ in $(seq 1 30); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 "$URL/connexion" || true)" = 200 ] && break
    sleep 2
  done
}

# Gems et paquets npm : le code est monté dans les conteneurs, les dépendances non.
# Sidekiq a ses propres gems ; node_modules n'est réinstallé que si le lock a changé.
# $1 / $2 : commits avant / après la mise à jour du code.
deps() {
  step "Dépendances Ruby"
  for c in funadf_app funadf_sidekiq; do
    remote "docker exec $c bundle check >/dev/null 2>&1 || docker exec $c bundle install --quiet"
  done
  if remote "cd $APP_DIR && ! git diff --quiet $1 $2 -- package.json package-lock.json"; then
    step "Dépendances npm"
    remote "docker exec funadf_app npm install --no-audit --no-fund 2>&1 | tail -3"
    # npm peut réécrire le lock (version de npm du conteneur) : on garde celui du dépôt
    remote "cd $APP_DIR && git checkout -q -- package-lock.json"
  fi
}

if [ "${1:-}" = "--rollback" ]; then
  SHA="${2:?Usage : ./deploy.sh --rollback <sha>}"
  step "Retour au commit $SHA"
  CURRENT="$(remote "cd $APP_DIR && git rev-parse --short HEAD")"
  remote "set -e; cd $APP_DIR; git reset -q --hard $SHA; git log --oneline -1"
  deps "$CURRENT" "$SHA"
  step "Reconstruction du front"
  remote "docker exec funadf_app bin/vite build --force 2>&1 | tail -3"
  restart
  check && echo "Retour arrière terminé." || { echo "Contrôles en échec après le retour arrière."; exit 1; }
  exit 0
fi

step "Vérifications avant déploiement"
git fetch -q origin master
TARGET="$(git rev-parse --short origin/master)"
PREVIOUS="$(remote "cd $APP_DIR && git rev-parse --short HEAD")"
echo "Production : $PREVIOUS -> origin/master : $TARGET"
if [ "$PREVIOUS" = "$TARGET" ]; then
  echo "Déjà à jour, rien à déployer."
  exit 0
fi
# package-lock.json n'est jamais modifié à la main sur le serveur, seulement par npm
remote "cd $APP_DIR && git checkout -q -- package-lock.json"
# Modifications locales du serveur (ex. config/unicorn.rb) : on refuse si master les touche
CONFLICTS="$(remote "cd $APP_DIR && git fetch -q origin master && comm -12 <(git diff --name-only | sort) <(git diff --name-only HEAD origin/master | sort)")"
if [ -n "$CONFLICTS" ]; then
  echo "Fichiers modifiés sur le serveur ET dans master, à traiter à la main :"
  echo "$CONFLICTS"
  exit 1
fi
remote "cd $APP_DIR && git log --oneline HEAD..origin/master" | cut -c1-100

step "Sauvegarde du front actuel"
# public/vite appartient à root (build dans le conteneur) : copie faite par le conteneur
remote "docker exec funadf_app cp -a /app/public/vite /app/tmp/vite-backup-$STAMP && echo $APP_DIR/tmp/vite-backup-$STAMP"
echo "$STAMP $PREVIOUS -> $TARGET" | remote "cat >> ~/deploy.log"

step "Mise à jour du code"
remote "set -e; cd $APP_DIR; git pull -q --ff-only origin master; git log --oneline -1"

deps "$PREVIOUS" "$TARGET"

step "Build du front"
remote "docker exec funadf_app bin/vite build --force 2>&1 | tail -3"

PENDING="$(remote "docker exec funadf_app bin/rails db:migrate:status 2>/dev/null | grep -E '^\s+down' || true")"
if [ -n "$PENDING" ]; then
  echo "Migrations en attente :"
  echo "$PENDING"
  if [ "${MIGRATE:-0}" = 1 ]; then
    step "Migrations"
    remote "docker exec funadf_app bin/rails db:migrate 2>&1 | tail -20"
  else
    echo "Non jouées (relancer avec MIGRATE=1 pour les jouer)."
  fi
fi

restart

if check; then
  echo
  echo "Déploiement de $TARGET terminé. Retour arrière : ./deploy.sh --rollback $PREVIOUS"
else
  echo
  echo "Contrôles en échec. Retour arrière : ./deploy.sh --rollback $PREVIOUS"
  exit 1
fi
