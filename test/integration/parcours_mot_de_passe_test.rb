require "test_helper"

# Mot de passe oublié : demande depuis /mot-de-passe-oublie, e-mail avec le lien,
# choix du nouveau mot de passe, puis connexion (web et mobile).
class ParcoursMotDePasseTest < ActionDispatch::IntegrationTest
  NEW_PASSWORD = 'Nouveau-mot-de-passe-9'.freeze

  def setup
    @user = users(:simple)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def reset_link(mail)
    mail.body.encoded[%r{https?://[^"\s<]+/users/password/edit\?reset_password_token=[^"\s<&]+}]
  end

  test "mot de passe oublié → e-mail → nouveau mot de passe → connexion" do
    get '/mot-de-passe-oublie'
    assert_response :success

    assert_emails 1 do
      post '/users/password', params: { email: @user.email }
    end
    assert_response :success
    assert_equal 'Email sent', json['message']

    mail = ActionMailer::Base.deliveries.last
    assert_equal [@user.email], mail.to
    assert_match 'Réinitialiser', mail.subject
    link = reset_link(mail)
    assert link, "l'e-mail contient le lien de réinitialisation"

    # Le lien ouvre la page de la SPA qui lit le jeton dans l'URL
    get link
    assert_response :success
    assert_match 'id="app"', @response.body

    token = Rack::Utils.parse_query(URI.parse(link).query)['reset_password_token']

    # Mots de passe différents : refusé, l'ancien reste valable
    put '/users/password', params: { reset_password_token: token, password: NEW_PASSWORD, password_confirmation: 'different' }
    assert_response :unprocessable_entity
    assert json['error'].any?
    assert @user.reload.valid_password?('123greetings')

    put '/users/password', params: { reset_password_token: token, password: NEW_PASSWORD, password_confirmation: NEW_PASSWORD }
    assert_response :success
    assert_equal 'Password updated', json['message']

    # Le jeton ne sert qu'une fois
    put '/users/password', params: { reset_password_token: token, password: 'Encore-un-autre-1', password_confirmation: 'Encore-un-autre-1' }
    assert_response :unprocessable_entity

    # L'ancien mot de passe ne marche plus, le nouveau oui
    post '/api/login', params: { email: @user.email, password: '123greetings' }
    assert_response :unauthorized
    assert_equal 'Invalid email or password', json['error']

    post '/api/login', params: { email: @user.email, password: NEW_PASSWORD }
    assert_response :created
    assert_equal @user.id, json['user']['id']

    post '/users/sign_in', params: { email: @user.email, password: NEW_PASSWORD }
    assert_response :created
    assert json['redirect'].present?

    get '/api/current_user', headers: { 'Authorization' => "Bearer #{json['token']}" }
    assert_response :success
    assert_equal @user.id, json['user']['id']
  end

  test "connexion : adresse inconnue ou mauvais mot de passe" do
    post '/api/login', params: { email: 'inconnu@yopmail.com', password: 'x' }
    assert_response :unauthorized
    post '/users/sign_in', params: { email: @user.email, password: 'mauvais' }
    assert_response :unauthorized
  end

  test "la connexion mobile crée un jeton quand aucun n'est actif" do
    @user.api_tokens.update_all(active: false)
    assert_difference -> { @user.api_tokens.where(active: true).count }, 1 do
      post '/users/sign_in', params: { email: @user.email, password: '123greetings' }
    end
    assert_response :created
  end

  test "un jeton désactivé ne donne plus accès à l'API" do
    token = @user.api_tokens.create!
    get '/api/current_user', headers: { 'Authorization' => "Bearer #{token.token}" }
    assert_response :success

    token.update!(active: false)
    get '/api/current_user', headers: { 'Authorization' => "Bearer #{token.token}" }
    assert_response :unauthorized
    assert_equal 'Bad credentials', json['message']
  end
end
