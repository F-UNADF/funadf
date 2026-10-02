Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Origines encore ouvertes : l'app mobile publiée (WebView) appelle l'API en
    # cross-origin. L'API s'authentifie par en-tête Bearer, sans cookie (pas de
    # `credentials: true`) : un site tiers ne peut rien lire sans le jeton.
    origins '*'
    # :delete est nécessaire à l'app mobile 1.6.1 (DELETE /api/device_tokens/:id).
    resource '*', headers: :any, methods: [:get, :post, :patch, :put, :delete, :options]
  end
end
