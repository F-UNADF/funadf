# FUNADF — intranet ADD+

Intranet « ADD+ » de la Fédération / Union Nationale des Assemblées de Dieu de France (prod `app.addfrance.fr`, recette `recette.add-fnadf.fr`). Une app mobile externe « Pasteurs ADD » (autre dépôt) consomme la même API `/api`.

## Stack
- **Rails 6.1.7 sur Ruby 3.2.4** : c'est la version du `Gemfile` et de `docker/rails/Dockerfile`. Le README est faux.
- MySQL 5.7, Sidekiq + sidekiq-scheduler (planification dans `config/sidekiq.yml`, pas en cron), Redis en persistance AOF.
- Front : une seule SPA **Vue 3 + Vuetify 3 + Vuex 4** (pas Pinia) + vue-router + vue-i18n dans `app/frontend/`, servie par vite_rails. Le code est en Options API et en JavaScript.

## Architecture
- **Toute la logique est dans `namespace :api`** (JSON). `ApiController` authentifie avec `Authorization: Bearer <ApiToken>`. La connexion passe par `POST /users/sign_in` (app mobile) ou `POST /api/login` (web), qui renvoient un `ApiToken`.
- Les namespaces `admin`, `association`, `region` et `me` ne font que servir la SPA : ce sont des actions vides avec un layout `vuejs`. L'espace courant est déduit du chemin de l'URL.
- **Chaque route de `app/frontend/router/router.js` doit exister dans `config/routes.rb`**, sinon le rechargement de la page renvoie un 404.
- **Formulaires génériques** : les écrans CRUD d'admin sont décrits côté serveur dans `app/services/ui_config/`, exposés par `/api/:model/config`, puis rendus par `components/Form/Fu*.vue` et `components/Database/FuDatabase.vue`.
- **Rôles** : un rôle applicatif est un `Membership` avec `structure_id: nil` (`admin`, `moderator`). Les rôles liés à une structure sont `president`, `secretary`, `treasurer`, `director` et `member`. La table `rolizations` a été supprimée : n'utilise plus `Rolization`.
- **Structures en STI** : `Church`, `Association` et `Region` héritent de `Structure`.
- **Notifications** :
  - `NotificationPostBroadcastJob` et `NotificationEventBroadcastJob` créent des `Notification`, en s'appuyant sur `JobRun` pour savoir depuis quand chercher.
  - `NotificationDigestJob` envoie les push via `FcmNotificationService` (API HTTP v1 de FCM).
  - Les tokens des appareils (`DeviceToken`, platform `web` ou `mobile`) sont enregistrés par `POST /api/device_tokens`.

## Commandes (Docker)
Tous les services ont un profil : `docker compose up` seul ne lance rien.

```sh
docker compose --profile local up -d          # app (3000, HMR Vite 3036), db (MySQL, port hôte 3307), redis, sidekiq
docker compose exec app bin/rails c
docker compose exec app bin/rails db:migrate
docker compose exec -e RAILS_ENV=test app bin/rails db:create db:schema:load   # première fois
docker compose exec -e RAILS_ENV=test app bin/rails test <fichier>
docker compose exec app bin/vite build        # vérifier le build front
docker compose exec app npm test              # tests du front (Vitest, test/javascript/)
bin/e2e                                       # tests de bout en bout (Playwright, test/e2e/, base funadf_e2e, entrée e2e: dans database.yml)
```

`REDIS_PASSWORD` est obligatoire dans `.env`.

## CI/CD (GitHub Actions)
- `.github/workflows/ci.yml` : tests Rails (MySQL 5.7 + Redis en services), `bin/vite build`, Brakeman (bloquant, alertes acceptées dans `config/brakeman.ignore`, fins de vie Ruby/Rails exclues) et bundler-audit (non bloquant). Lancée sur chaque PR et sur `develop`.
- `.github/workflows/deploy.yml` : un push sur `master` rejoue la CI puis lance `deploy.sh` après approbation de l'environnement GitHub `production`. Le lancement manuel permet de jouer les migrations ou de revenir à un commit (`rollback_sha`). Secrets de l'environnement : `DEPLOY_HOST`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`.
- `deploy.sh` reste utilisable depuis un poste de dev (`MIGRATE=1` pour jouer les migrations).

## Pièges
- **Autoloader probablement `:classic`** (`config/application.rb` n'appelle pas `load_defaults`) : des noms de classes qui ne correspondent pas à leur fichier passent sans erreur. Respecte la correspondance entre chemin et nom de classe.
- `lib/array.rb` redéfinit `Array#to_h(keys)`.
- Fuseau horaire : `default_timezone = :local` et `time_zone_aware_attributes = false`. Les dates sont stockées en heure de Paris.
- Le schéma mélange les charsets `utf8` et `latin1` (les tables récentes sont en `latin1`). Pour les nouvelles tables, préfère `utf8mb4`.
- Beaucoup de SQL brut. N'interpole jamais d'entrée utilisateur : utilise des paramètres liés.
- Tests Minitest (`bin/rails test`) avec couverture SimpleCov (`coverage/index.html`, `COVERAGE=0` pour la couper). `test/controllers/api/mobile_contract_test.rb` fige le contrat avec l'app mobile : ne change pas une clé JSON qu'il vérifie sans vérifier `funadf-app`. Le géocodage est simulé et les jobs restent en mémoire (adaptateur `:test`). Il n'y a aucun linter (ni rubocop, ni eslint) : imite le code voisin.
- En production, les logs Rails partent vers Logtail, pas dans `log/`.
- Le fichier `core` à la racine est un fichier vide, pas un dossier.

## Conventions
- Identifiants en anglais. Commentaires, textes d'interface et libellés i18n en français.
- Messages de commit en français : `master: <Message court>` sur master, `feature/<CamelCase>` ou `hotfix/<CamelCase>` pour les branches.
