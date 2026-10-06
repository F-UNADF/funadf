require "test_helper"

# « Se connecter en tant que » : un admin (ou un modérateur) prend l'identité d'un
# membre pour voir ce qu'il voit, agit en son nom, puis revient à son compte.
class ParcoursUsurpationTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @member = users(:simple)
    @other = users(:other)
    @headers = auth_headers(@admin)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  test "usurpation par un admin : identité du membre, menus du membre, puis retour" do
    get "/api/switch/#{@member.id}", headers: @headers
    assert_response :success
    assert_equal @member.id, json['current_user']['id']
    assert_equal @admin.id, json['original_user']['id']
    assert_equal '/', json['redirect_to']

    # L'admin voit l'application comme le membre
    get '/api/current_user', headers: @headers
    assert_equal @member.id, json['user']['id']
    assert_equal @admin.id, json['original_user']['id']
    assert_equal [], json['roles']

    get '/api/menus/me', headers: @headers
    assert_not json.any? { |item| item['title'] == 'Admin' }, "le membre n'a pas l'accès admin"

    get '/api/users', params: { domain: 'admin' }, headers: @headers
    assert_response :forbidden, "les droits sont ceux du membre usurpé"

    # Le membre usurpé modifie son profil
    patch "/api/users/#{@member.id}", params: { user: { user: { town: 'Marseille' } } }, headers: @headers
    assert_response :success
    assert_equal 'Marseille', @member.reload.town

    # Une seconde usurpation est refusée tant qu'on n'est pas revenu
    get "/api/switch/#{@other.id}", headers: @headers
    assert_response :success
    assert_equal 403, json['status']
    assert_equal 'Already switched', json['message']

    # Retour à l'admin
    get '/api/switch_back', headers: @headers
    assert_response :success
    assert_equal @admin.id, json['current_user']['id']
    assert_equal '/admin/users', json['redirect_to']

    get '/api/current_user', headers: @headers
    assert_equal @admin.id, json['user']['id']
    assert_nil json['original_user']
    assert_includes json['roles'], 'admin'
  end

  test "un modérateur usurpe un membre, pas un admin" do
    moderator = @other
    moderator.add_role :moderator
    headers = auth_headers(moderator)

    get "/api/switch/#{@admin.id}", headers: headers
    assert_response :forbidden

    get "/api/switch/#{@member.id}", headers: headers
    assert_response :success
    get '/api/current_user', headers: headers
    assert_equal @member.id, json['user']['id']
  end

  test "usurpation d'un utilisateur inconnu : 404" do
    get '/api/switch/999999', headers: @headers
    assert_response :not_found
    assert_equal 'Record not found', json['message']
  end

  test "un admin qui perd ses droits pendant l'usurpation retrouve sa propre identité" do
    get "/api/switch/#{@member.id}", headers: @headers
    @admin.remove_role :admin

    get '/api/current_user', headers: @headers
    assert_equal @admin.id, json['user']['id']
  end

  test "un utilisateur usurpé supprimé entre-temps : on reste soi-même" do
    get "/api/switch/#{@member.id}", headers: @headers
    @member.destroy

    get '/api/current_user', headers: @headers
    assert_equal @admin.id, json['user']['id']
  end
end
