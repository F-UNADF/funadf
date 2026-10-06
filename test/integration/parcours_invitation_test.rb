require "test_helper"

# Parcours complet d'un nouvel utilisateur : un admin l'invite depuis l'espace
# admin, l'invité ouvre le lien de l'e-mail, choisit son mot de passe, se
# connecte (web puis mobile) et complète son profil.
class ParcoursInvitationTest < ActionDispatch::IntegrationTest
  PASSWORD = 'Mot-de-passe-invite-1'.freeze

  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  # Lien « Accepter l'invitation » du dernier e-mail envoyé.
  def invitation_link(mail)
    body = mail.body.encoded
    body[%r{https?://[^"\s<]+/users/invitation/accept\?invitation_token=[^"\s<&]+}]
  end

  test "admin invite, l'invité accepte avec le lien de l'e-mail, se connecte puis met à jour son profil" do
    # 1. L'admin invite depuis l'espace admin
    assert_emails 1 do
      post '/api/users', params: { user: { user: { email: 'nouveau.pasteur@yopmail.com', firstname: 'paul', lastname: 'martin' } } },
                         headers: auth_headers(@admin)
    end
    assert_response :success
    invited = User.find_by(email: 'nouveau.pasteur@yopmail.com')
    assert_equal 'Paul', invited.firstname
    assert_equal 'MARTIN', invited.lastname
    assert_nil invited.invitation_accepted_at

    mail = ActionMailer::Base.deliveries.last
    assert_equal ['nouveau.pasteur@yopmail.com'], mail.to
    assert_match 'Bienvenue', mail.subject
    link = invitation_link(mail)
    assert link, "l'e-mail contient le lien d'acceptation"

    # Tant qu'il n'a pas accepté, l'invité ne peut pas se connecter
    post '/api/login', params: { email: invited.email, password: PASSWORD }
    assert_response :unauthorized

    # 2. L'invité ouvre le lien : formulaire de choix du mot de passe
    get link
    assert_response :success
    token = Rack::Utils.parse_query(URI.parse(link).query)['invitation_token']
    assert_match token, @response.body

    # 3. Il choisit son mot de passe (confirmation erronée d'abord)
    put '/users/invitation', params: { user: { invitation_token: token, password: PASSWORD, password_confirmation: 'autre' } }
    assert_response :success, "le formulaire est réaffiché avec l'erreur"
    assert_nil invited.reload.invitation_accepted_at

    put '/users/invitation', params: { user: { invitation_token: token, password: PASSWORD, password_confirmation: PASSWORD } }
    assert_response :redirect
    assert invited.reload.invitation_accepted_at.present?

    # Le lien ne sert qu'une fois
    get link
    assert_response :redirect

    # 4. Connexion web puis mobile avec le nouveau mot de passe
    post '/api/login', params: { email: invited.email, password: PASSWORD }
    assert_response :created
    web_token = json['token']

    post '/users/sign_in', params: { email: invited.email, password: PASSWORD }
    assert_response :created
    assert_equal web_token, json['token'], "le jeton actif est réutilisé"

    headers = { 'Authorization' => "Bearer #{web_token}" }
    get '/api/current_user', headers: headers
    assert_equal invited.id, json['user']['id']
    assert_equal 'Non renseigné', json['user']['level']
    assert_equal [], json['roles']

    # 5. Il complète son profil (adresse, téléphone) puis change son mot de passe
    patch "/api/users/#{invited.id}", params: { user: { user: { town: 'Lyon', phone_1: '0600000000', biography: 'Pasteur' } } }, headers: headers
    assert_response :success
    assert_equal 'Lyon', invited.reload.town

    patch "/api/users/#{invited.id}",
          params: { user: { user: { firstname: 'Paul', password: 'Nouveau-secret-2', password_confirmation: 'Nouveau-secret-2' } } }, headers: headers
    assert_response :success
    assert invited.reload.valid_password?('Nouveau-secret-2')

    get '/api/profile', headers: headers
    assert_response :success
    assert_equal 'Lyon', json['profile']['town']
  end

  test "un admin réinvite un utilisateur qui n'a pas encore accepté : nouveau lien, l'ancien ne marche plus" do
    post '/api/users', params: { user: { user: { email: 'relance@yopmail.com', firstname: 'a', lastname: 'b' } } }, headers: auth_headers(@admin)
    invited = User.find_by(email: 'relance@yopmail.com')
    first_link = invitation_link(ActionMailer::Base.deliveries.last)

    assert_emails 1 do
      post "/api/users/#{invited.id}/send_invitation", headers: auth_headers(@admin)
    end
    second_link = invitation_link(ActionMailer::Base.deliveries.last)
    assert_not_equal first_link, second_link

    get first_link
    assert_response :redirect
    get second_link
    assert_response :success
  end

  test "un admin ne peut pas inviter une adresse déjà utilisée ou invalide" do
    assert_no_difference -> { User.count } do
      post '/api/users', params: { user: { user: { email: users(:other).email, firstname: 'Pirate', lastname: 'Doublon' } } },
                         headers: auth_headers(@admin)
    end
    assert_response :unprocessable_entity
    assert json['errors'].any?
    assert_equal 'Other', users(:other).reload.firstname

    post '/api/users', params: { user: { user: { email: 'pas-une-adresse', firstname: 'a', lastname: 'b' } } }, headers: auth_headers(@admin)
    assert_response :unprocessable_entity

    post '/api/users', params: { user: { user: { email: 'sans-nom@yopmail.com' } } }, headers: auth_headers(@admin)
    assert_response :unprocessable_entity
    assert_not User.exists?(email: 'sans-nom@yopmail.com')
  end

  test "l'invitation d'une adresse existante ne touche pas au parcours du compte existant" do
    post '/api/users', params: { user: {
      user: { email: users(:other).email, firstname: 'x', lastname: 'y' },
      gratitudes: { '0' => { level: 'Pasteur APE', start_at: '2020-01-01' } },
      fees: { '0' => { what: '2025', amount: 1, paid_at: '2025-01-01' } }
    } }, headers: auth_headers(@admin)
    assert_response :unprocessable_entity
    assert_equal 0, users(:other).gratitudes.count
    assert_equal 0, users(:other).fees.count
  end
end
