# Environnement e2e uniquement : le serveur de test est en HTTP, or le cookie de session
# est « secure » (config/initializers/session_store.rb) et Rack ne l'écrit qu'en HTTPS.
# Placé juste après le CookieStore, ce middleware lève l'option pour la requête en cours
# (et passe SameSite de None à Lax, que Chrome n'accepte pas sans « secure »), afin que
# la session (« se connecter en tant que ») soit conservée comme en production.
class E2eHttpSession
  def initialize(app)
    @app = app
  end

  def call(env)
    options = env[Rack::RACK_SESSION_OPTIONS]
    if options
      options[:secure] = false
      options[:same_site] = :lax
    end
    @app.call(env)
  end
end
