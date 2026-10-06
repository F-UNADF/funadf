require "test_helper"

# Églises, associations et régions : cas limites (saisie invalide, rôle inconnu,
# rôle « member » absent de la base, recherche, espaces) et droits du responsable.
class Api::StructuresEdgeTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @headers = auth_headers(@admin)
    @member = users(:simple)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  STRUCTURES = { 'churches' => [Church, 'church'], 'associations' => [Association, 'association'], 'regions' => [Region, 'region'] }.freeze

  STRUCTURES.each do |path, (klass, key)|
    test "#{path} : une modification avec un nom vide est refusée" do
      record = klass.create!(name: 'Avant', town: 'Paris')
      patch "/api/#{path}/#{record.id}", params: { key => { name: '' } }, headers: @headers
      assert_response :success
      assert_equal 422, json['status']
      assert json['errors']['name'].any?
      assert_equal 'Avant', record.reload.name
    end

    test "#{path} : sans rôle « member » en base, l'ajout de membres est refusé" do
      Role.where(name: 'member').destroy_all
      record = klass.create!(name: 'Sans rôle')
      post "/api/#{path}/#{record.id}/members", params: { members: [{ id: @member.id, type: 'User' }] }, headers: @headers, as: :json
      assert_equal 400, json['status']
      assert_equal 0, record.memberships.count
    end

    test "#{path} : un rôle inconnu ou applicatif est refusé" do
      record = klass.create!(name: 'Rôles')
      membership = @member.memberships.create!(structure: record, role: Role.find_or_create_by!(name: 'member'))
      %w[inexistant admin moderator].each do |role|
        post "/api/#{path}/#{record.id}/roles/edit", params: { member: { membership_id: membership.id }, role: role },
                                                    headers: @headers, as: :json
        assert_response :unprocessable_entity, role
        assert_equal 'member', membership.reload.role.name
      end
    end

    test "#{path} : un membre simple ne gère pas la structure" do
      record = klass.create!(name: 'Interdite')
      member_headers = auth_headers(@member)
      patch "/api/#{path}/#{record.id}", params: { key => { name: 'Pirate' } }, headers: member_headers
      assert_response :forbidden
      post "/api/#{path}/#{record.id}/members", params: { members: [{ id: @member.id, type: 'User' }] }, headers: member_headers, as: :json
      assert_response :forbidden
      post "/api/#{path}/#{record.id}/roles/edit", params: { member: { membership_id: 0 }, role: 'president' }, headers: member_headers, as: :json
      assert_response :forbidden
      post "/api/#{path}", params: { key => { name: 'Nouvelle' } }, headers: member_headers
      assert_response :forbidden
      delete "/api/#{path}/#{record.id}", headers: member_headers
      assert_response :forbidden
      assert_equal 'Interdite', record.reload.name
    end

    test "#{path} : sans authentification, 401" do
      get "/api/#{path}"
      assert_response :unauthorized
    end

    test "#{path} : un rôle sur l'adhésion d'une autre structure renvoie 404" do
      record = klass.create!(name: 'Ici')
      other = Association.create!(name: 'Ailleurs')
      membership = @member.memberships.create!(structure: other, role: Role.find_or_create_by!(name: 'member'))
      post "/api/#{path}/#{record.id}/roles/edit", params: { member: { membership_id: membership.id }, role: 'president' },
                                                  headers: @headers, as: :json
      assert_response :not_found
    end
  end

  test "l'espace « association » d'un utilisateur sans responsabilité est vide" do
    get '/api/associations', params: { domain: 'association' }, headers: auth_headers(@member)
    assert_response :success
    assert_equal [], json['associations']
  end

  test "la recherche d'églises sans résultat" do
    get '/api/churches', params: { search: 'introuvable' }, headers: @headers
    assert_equal [], json['churches']
  end

  test "l'espace de la SPA est lu dans l'en-tête Referer sans changer la réponse" do
    %w[https://www.example.com/admin/churches https://www.example.com/feed].each do |referer|
      get '/api/churches', headers: @headers.merge('Referer' => referer)
      assert_response :success
      assert_equal Church.count, json['churches'].size
    end
  end

  test "une église peut être modifiée par l'admin, y compris son site" do
    church = structures(:church)
    patch "/api/churches/#{church.id}", params: { church: { website: 'https://eglise.example' } }, headers: @headers
    assert_equal 200, json['status']
    assert_equal 'https://eglise.example', church.reload.website
  end
end
