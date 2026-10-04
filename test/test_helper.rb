# Couverture : rapport HTML dans coverage/ (COVERAGE=0 pour la désactiver)
unless ENV['COVERAGE'] == '0'
  require 'simplecov'
  SimpleCov.start 'rails' do
    enable_coverage :branch
  end
end

ENV["RAILS_ENV"] ||= "test"
require_relative '../config/environment'
require 'rails/test_help'
# Charge tout app/ pour que les fichiers jamais exécutés comptent dans la couverture
Rails.application.eager_load! unless ENV['COVERAGE'] == '0'

# Géocodage des églises et régions : pas d'appel réseau en test
Geocoder.configure(lookup: :test, ip_lookup: :test)
Geocoder::Lookup::Test.set_default_stub([{ 'coordinates' => [48.8566, 2.3522] }])

class ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers
  fixtures :all
end

class ActionDispatch::IntegrationTest
  # En-tête d'authentification de l'API (jeton Bearer actif) pour `user`.
  def auth_headers(user)
    { 'Authorization' => "Bearer #{user.api_tokens.create!.token}" }
  end
end
