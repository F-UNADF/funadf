ENV["RAILS_ENV"] ||= "test"
require_relative '../config/environment'
require 'rails/test_help'

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
