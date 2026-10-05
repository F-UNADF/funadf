require "test_helper"

# Un compte désactivé par un admin ne peut plus rien faire dans l'app.
class Api::DisabledAccountTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:simple)
    @token = @user.api_tokens.create!
    @headers = { 'Authorization' => "Bearer #{@token.token}" }
    https!
  end

  def disable!
    @user.update!(disabled: true)
  end

  test "un compte actif se connecte et utilise l'API" do
    post '/api/login', params: { email: @user.email, password: '123greetings' }
    assert_response :created
    get '/api/current_user', headers: @headers
    assert_response :success
  end

  test "connexion web refusée" do
    disable!
    post '/api/login', params: { email: @user.email, password: '123greetings' }
    assert_response :unauthorized
    assert_nil JSON.parse(@response.body)['token']
  end

  test "connexion mobile refusée" do
    disable!
    post '/users/sign_in', params: { email: @user.email, password: '123greetings' }
    assert_response :unauthorized
    assert_nil JSON.parse(@response.body)['token']
  end

  test "un jeton émis avant la désactivation ne donne plus accès à l'API" do
    disable!
    %w[/api/current_user /api/profile /api/feed /api/votes /api/documents].each do |path|
      get path, headers: @headers
      assert_response :unauthorized, path
    end
    post '/api/votes', params: { campaign_id: 0 }, headers: @headers, as: :json
    assert_response :unauthorized
  end

  test "pas de session Archivate pour un compte désactivé" do
    post '/api/archivate/sso/generate', headers: @headers
    assert_response :created
    sso_token = JSON.parse(@response.body)['token']

    disable!
    post '/api/archivate/sso/validate', params: { token: sso_token }
    assert_response :unauthorized
    post '/api/archivate/sso/generate', headers: @headers
    assert_response :unauthorized
  end

  test "réactivé par un admin, le compte retrouve l'accès" do
    disable!
    admin = users(:admin)
    admin.add_role :admin
    patch "/api/users/#{@user.id}/enable", headers: auth_headers(admin)
    assert_response :success

    get '/api/current_user', headers: @headers
    assert_response :success
  end

  test "la désactivation par un admin coupe l'accès immédiatement" do
    admin = users(:admin)
    admin.add_role :admin
    patch "/api/users/#{@user.id}/disable", headers: auth_headers(admin)
    assert_response :success

    get '/api/current_user', headers: @headers
    assert_response :unauthorized
  end
end
