# Environnement des tests de bout en bout (Playwright, test/e2e/).
# Dérivé de test.rb, mais pour un vrai serveur HTTP (port 3100) qui sert la SPA
# construite par Vite (public/vite-e2e) et une base dédiée (funadf_e2e).
# Lancement : bin/e2e (mode d'emploi en tête du script).
require Rails.root.join('test/e2e/support/mail_catcher')
require Rails.root.join('test/e2e/support/http_session')

E2E_HOST = ENV.fetch('E2E_HOST', '127.0.0.1:3100')

Rails.application.configure do
  config.cache_classes = true
  config.eager_load = true

  # Fichiers de public/ (dont le build Vite) servis par Rails
  config.public_file_server.enabled = true
  config.public_file_server.headers = { 'Cache-Control' => 'public, max-age=3600' }

  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store
  config.action_dispatch.show_exceptions = true

  config.log_level = :info
  config.active_support.deprecation = :log

  # Pas de secrets.yml (non versionné) en CI : clé fixe, propre à cet environnement
  config.secret_key_base = 'e2e-funadf-' + ('0' * 64)

  # Pas de Redis ni de Sidekiq : les jobs (e-mails, analyse des fichiers) s'exécutent tout de suite
  config.active_job.queue_adapter = :inline

  # E-mails capturés dans tmp/e2e/mails/*.json (lus par test/e2e/support/mails.js)
  ActionMailer::Base.add_delivery_method :e2e_catcher, E2eMailCatcher
  config.action_mailer.delivery_method = :e2e_catcher
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { host: E2E_HOST, protocol: 'http' }
  Rails.application.routes.default_url_options[:host] = E2E_HOST

  # Fichiers déposés : disque local, jamais le bucket S3 de config/storage.yml
  config.active_storage.service_configurations = {
    e2e: { service: 'Disk', root: Rails.root.join('tmp/e2e/storage').to_s }
  }
  config.active_storage.service = :e2e

  # Serveur en HTTP : cookie de session écrit malgré son option « secure » (voir le middleware)
  config.middleware.insert_after ActionDispatch::Session::CookieStore, E2eHttpSession

  config.after_initialize do
    # Géocodage des églises et régions : pas d'appel réseau
    Geocoder.configure(lookup: :test, ip_lookup: :test)
    Geocoder::Lookup::Test.set_default_stub([{ 'coordinates' => [48.8566, 2.3522] }])
  end
end
