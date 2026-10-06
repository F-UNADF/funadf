require "test_helper"

# Pages Devise (hors API) : formulaire d'invitation Devise inutilisé et
# verrouillé, acceptation d'une invitation (HTML et JSON), images par défaut.
class DevisePagesTest < ActionDispatch::IntegrationTest
  PASSWORD = 'Mot-de-passe-invite-1'.freeze

  def setup
    https!
  end

  def invite(email)
    User.invite!(email: email, firstname: 'Invité', lastname: 'Test') { |u| u.skip_invitation = true }
  end

  test "le formulaire d'invitation Devise exige une connexion" do
    get '/users/invitation/new'
    assert_redirected_to '/users/sign_in'
    post '/users/invitation', params: { user: { email: 'x@yopmail.com', firstname: 'a', lastname: 'b' } }
    assert_redirected_to '/users/sign_in'
    assert_not User.exists?(email: 'x@yopmail.com')
  end

  test "une session Devise de membre ne permet pas d'inviter quelqu'un" do
    sign_in users(:simple)
    assert_no_emails do
      post '/users/invitation', params: { user: { email: 'intrus@yopmail.com', firstname: 'a', lastname: 'b' } }
    end
    assert_response :forbidden
    assert_not User.exists?(email: 'intrus@yopmail.com')

    get '/users/invitation/new'
    assert_response :forbidden
  end

  test "l'invité qui accepte puis revient sur le lien est déjà connecté : redirection" do
    invited = invite('deux-fois@yopmail.com')
    token = invited.raw_invitation_token
    put '/users/invitation', params: { user: { invitation_token: token, password: PASSWORD, password_confirmation: PASSWORD } }
    assert_response :redirect

    get '/users/invitation/accept', params: { invitation_token: token }
    assert_response :redirect
  end

  test "un compte désactivé qui accepte son invitation n'est pas connecté" do
    invited = invite('desactive@yopmail.com')
    invited.update_column(:disabled, true)
    put '/users/invitation', params: { user: { invitation_token: invited.raw_invitation_token, password: PASSWORD, password_confirmation: PASSWORD } }
    assert invited.reload.valid_password?(PASSWORD)

    post '/api/login', params: { email: invited.email, password: PASSWORD }
    assert_response :unauthorized
  end

  test "un lien d'invitation invalide en JSON est refusé" do
    get '/users/invitation/accept', params: { invitation_token: 'faux' }, as: :json
    assert_response :redirect
  end

  test "la page de connexion Devise et la page du support servent la SPA" do
    get '/connexion'
    assert_response :success
    get '/support'
    assert_response :success
  end

  # ---------- Avatars et logos ----------

  test "avatar : image téléversée, initiales ou visuel par défaut" do
    user = users(:simple)
    get "/avatars/#{user.id}"
    assert_match 'text=SU', @response.location
    get '/avatars/undefined'
    assert_match 'text=Avatar', @response.location

    user.avatar.attach(io: File.open(file_fixture('image.png')), filename: 'avatar.png', content_type: 'image/png')
    get "/avatars/#{user.id}"
    assert_response :redirect
    assert_match '/rails/active_storage/representations/', @response.location
  end

  test "logo : image téléversée, initiales ou visuel par défaut" do
    structure = structures(:association)
    get "/logos/#{structure.id}"
    assert_match 'text=BO', @response.location
    get '/logos/undefined'
    assert_match 'text=Logo', @response.location

    structure.logo.attach(io: File.open(file_fixture('image.png')), filename: 'logo.png', content_type: 'image/png')
    get "/logos/#{structure.id}"
    assert_match '/rails/active_storage/representations/', @response.location
  end

  test "avatar ou logo d'un enregistrement inconnu : 404" do
    assert_raises(ActiveRecord::RecordNotFound) { get '/avatars/999999' }
    assert_raises(ActiveRecord::RecordNotFound) { get '/logos/999999' }
  end
end
