require "test_helper"

# Pages servies par Rails pour la SPA : chaque route du routeur Vue doit répondre,
# sinon un rechargement de la page renvoie une erreur.
class SpaPagesTest < ActionDispatch::IntegrationTest
  def setup
    https!
  end

  PAGES = %w[
    /connexion /mot-de-passe-oublie /support /app /privacy
    /feed /annuaire /mon-profil /documents /archivate /campaigns /mon-eglise /actus/1 /evenements/1
    /admin/users /admin/churches /admin/associations /admin/campaigns /admin/events /admin/posts
    /admin/roles /admin/fees /admin/documents /admin/push_notifications /admin/regions
    /association/associations /association/campaigns /association/members
    /region/members /region/campaigns /region/events /region/posts
  ].freeze

  PAGES.each do |path|
    test "#{path} sert la SPA" do
      get path
      assert_response :success
      assert_match 'id="app"', @response.body
    end
  end

  { '/' => '/feed', '/admin' => '/admin/users', '/association' => '/association/associations',
    '/region' => '/region/members' }.each do |from, to|
    test "#{from} redirige vers #{to}" do
      get from
      assert_redirected_to to
    end
  end

  test "l'ancienne page de connexion Devise redirige vers /connexion" do
    get '/users/sign_in'
    assert_redirected_to '/connexion'
  end

  test "la page de choix du mot de passe (lien de l'e-mail) sert la SPA" do
    get '/users/password/edit', params: { reset_password_token: 'jeton' }
    assert_response :success
  end

  test "mot de passe oublié : envoi de l'e-mail, adresse inconnue" do
    assert_emails 1 do
      post '/users/password', params: { email: users(:simple).email }
    end
    assert_response :success

    post '/users/password', params: { email: 'inconnu@yopmail.com' }
    assert_response :not_found
  end

  test "nouveau mot de passe avec le jeton reçu par e-mail" do
    token = users(:simple).send_reset_password_instructions

    put '/users/password', params: { reset_password_token: token, password: 'nouveau-mot-de-passe', password_confirmation: 'nouveau-mot-de-passe' }
    assert_response :success
    assert users(:simple).reload.valid_password?('nouveau-mot-de-passe')

    put '/users/password', params: { reset_password_token: 'faux', password: 'x12345678', password_confirmation: 'x12345678' }
    assert_response :unprocessable_entity
  end

  test "/campaigns/:id (page de vote) sert la SPA au rechargement" do
    get "/campaigns/#{campaigns(:one).id}"
    assert_response :success
    assert_match 'id="app"', @response.body
  end

  test "l'ancienne URL publique du PDF des résultats ne le sert plus" do
    assert_raises(ActionController::RoutingError) { get "/campaigns/#{campaigns(:one).id}.pdf" }
  end
end
