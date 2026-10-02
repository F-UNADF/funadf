require "test_helper"

# Aucune réponse JSON ne doit contenir de jeton ni de secret d'un utilisateur.
class ExposureTest < ActionDispatch::IntegrationTest
  SECRETS = %w[access_token authentication_token fcm_token encrypted_password
               reset_password_token invitation_token].freeze

  def setup
    @member = users(:simple)
    @other  = users(:other)
    @admin  = users(:admin)
    @admin.add_role :admin
  end

  def assert_no_secret(json, context)
    SECRETS.each do |key|
      assert_not json.to_s.include?(key), "#{context} expose #{key}"
    end
    %w[jeton-acces-direct-other jeton-authentification-other jeton-fcm-other].each do |value|
      assert_not json.to_s.include?(value), "#{context} expose la valeur d'un jeton"
    end
  end

  test "current_user n'expose pas les jetons de l'utilisateur" do
    get api_current_user_url(subdomain: nil), headers: auth_headers(@other)
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal @other.id, body['user']['id']
    assert_equal 'Other', body['user']['firstname']
    assert body['user'].key?('level'), "level est lu par l'app mobile"
    assert_no_secret @response.body, 'GET /api/current_user'
  end

  test "la connexion mobile ne renvoie pas les jetons de l'utilisateur" do
    post user_session_url(subdomain: nil), params: { email: @other.email, password: '123greetings' }
    assert_response :created
    body = JSON.parse(@response.body)
    assert body['token'].present?, "le jeton d'API reste renvoyé"
    assert_equal @other.id, body['user']['id']
    assert_no_secret body['user'].to_json, 'POST /users/sign_in'
  end

  test "la connexion web ne renvoie pas les jetons de l'utilisateur" do
    post api_login_url(subdomain: nil), params: { email: @other.email, password: '123greetings' }
    assert_response :created
    assert_no_secret JSON.parse(@response.body)['user'].to_json, 'POST /api/login'
  end

  test "la fiche annuaire d'un membre n'expose ni ses jetons ni ses cotisations" do
    @other.fees.create!(what: '2025', amount: 50, paid_at: Date.today)

    get api_user_url(subdomain: nil, id: @other.id), headers: auth_headers(@member)
    assert_response :success
    body = JSON.parse(@response.body)
    assert_equal 'Other', body['user']['firstname']
    assert body.key?('gratitudes'), "gratitudes est lu par l'annuaire mobile"
    assert_no_secret @response.body, 'GET /api/users/:id'
    assert_empty Array(body['fees']), "les cotisations d'un autre membre ne sont pas exposées"
  end

  test "un admin voit les cotisations dans la fiche" do
    @other.fees.create!(what: '2025', amount: 50, paid_at: Date.today)

    get api_user_url(subdomain: nil, id: @other.id), headers: auth_headers(@admin)
    assert_response :success
    assert_equal 1, JSON.parse(@response.body)['fees'].length
  end

  test "la liste admin des utilisateurs n'expose pas les mots de passe chiffrés ni les jetons" do
    get api_users_url(subdomain: nil), params: { domain: 'admin' }, headers: auth_headers(@admin)
    assert_response :success
    users = JSON.parse(@response.body)['users']
    assert users.any? { |u| u['id'] == @other.id }
    assert_no_secret @response.body, 'GET /api/users?domain=admin'
  end
end
