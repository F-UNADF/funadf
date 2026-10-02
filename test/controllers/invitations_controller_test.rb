require "test_helper"

# PUT /users/invitation : acceptation d'une invitation (choix du mot de passe).
class InvitationsControllerTest < ActionDispatch::IntegrationTest
  NEW_PASSWORD = 'Nouveau-mot-de-passe-1'.freeze

  test "sans jeton d'invitation, on ne peut pas changer le mot de passe d'un compte existant" do
    victim = users(:simple)
    assert_nil victim.invitation_token

    put user_invitation_url(subdomain: nil),
      params: { user: { password: NEW_PASSWORD, password_confirmation: NEW_PASSWORD } }

    assert_not User.all.any? { |u| u.valid_password?(NEW_PASSWORD) }, "un compte a reçu le mot de passe de l'attaquant"
    assert victim.reload.valid_password?('123greetings')
  end

  test "avec un faux jeton, on ne peut pas changer le mot de passe d'un compte existant" do
    put user_invitation_url(subdomain: nil),
      params: { user: { invitation_token: 'jeton-invente', password: NEW_PASSWORD, password_confirmation: NEW_PASSWORD } }

    assert_not User.all.any? { |u| u.valid_password?(NEW_PASSWORD) }
  end

  test "un invité choisit son mot de passe avec le jeton reçu par e-mail" do
    invited = User.invite!(email: 'invite@yopmail.com', firstname: 'Invité', lastname: 'Test') { |u| u.skip_invitation = true }
    raw_token = invited.raw_invitation_token

    put user_invitation_url(subdomain: nil),
      params: { user: { invitation_token: raw_token, password: NEW_PASSWORD, password_confirmation: NEW_PASSWORD } }

    invited.reload
    assert invited.valid_password?(NEW_PASSWORD)
    assert invited.invitation_accepted_at.present?
  end
end
