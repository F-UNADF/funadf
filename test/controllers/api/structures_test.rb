require "test_helper"

# Églises, associations et régions : parcours complets d'un admin
# (liste, fiche, création, modification, membres, rôles, suppression).
class Api::StructuresTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @member = users(:simple)
    @headers = auth_headers(@admin)
    @member_role = Role.find_or_create_by!(name: 'member')
    Role.find_or_create_by!(name: 'president')
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  { 'churches' => [Church, 'church'], 'associations' => [Association, 'association'], 'regions' => [Region, 'region'] }.each do |path, (klass, key)|
    test "#{path} : un admin crée, lit, modifie et supprime une structure" do
      post "/api/#{path}", params: { key => { name: 'Nouvelle', zipcode: '75001', town: 'Paris' } }, headers: @headers
      assert_response :success
      assert_equal 200, json['status']
      record = klass.find(json[key]['id'])
      assert_equal 'Paris', record.town

      get "/api/#{path}/#{record.id}", headers: @headers
      assert_response :success
      assert_equal record.id, json[key]['id']
      assert_equal [], json['members']

      patch "/api/#{path}/#{record.id}", params: { key => { name: 'Renommée' } }, headers: @headers
      assert_response :success
      assert_equal 'Renommée', record.reload.name

      delete "/api/#{path}/#{record.id}", headers: @headers
      assert_response :success
      assert_not klass.exists?(record.id)
    end

    test "#{path} : la liste renvoie les structures avec leur président" do
      record = klass.create!(name: 'Listée')
      @member.add_role :president, record

      get "/api/#{path}", headers: @headers
      assert_response :success
      listed = json[path].find { |s| s['id'] == record.id }
      assert listed, "#{record.name} absente de la liste"
      assert listed.key?('president')
    end

    test "#{path} : un admin ajoute un membre, change son rôle puis le retire" do
      record = klass.create!(name: 'Avec membres')

      post "/api/#{path}/#{record.id}/members",
        params: { members: [{ id: @member.id, type: 'User' }, { id: 0, type: 'Pirate' }] }, headers: @headers
      assert_response :success
      membership = record.memberships.find_by!(member: @member)
      assert_equal 'member', membership.role_name
      assert_equal 1, record.memberships.count, "un type de membre inconnu est ignoré"

      post "/api/#{path}/#{record.id}/roles/edit",
        params: { member: { membership_id: membership.id }, role: 'president' }, headers: @headers
      assert_response :success
      assert_equal 'president', json['membership']['role_name']
      assert_equal 'president', membership.reload.role_name

      post "/api/#{path}/#{record.id}/roles/edit",
        params: { member: { membership_id: membership.id }, role: 'inexistant' }, headers: @headers
      assert_response :unprocessable_entity
    end

    test "#{path} : un nom vide est refusé" do
      klass.validators_on(:name).any? or skip "#{klass} ne valide pas le nom"
      post "/api/#{path}", params: { key => { name: '' } }, headers: @headers
      assert_equal 422, json['status']
    end
  end

  test "une église retire un membre" do
    church = structures(:church)
    membership = church.memberships.create!(member: @member, role: @member_role)

    delete "/api/churches/#{church.id}/members/#{membership.id}", headers: @headers
    assert_response :success
    assert_not Membership.exists?(membership.id)
  end

  test "la recherche d'églises filtre par nom, code postal ou ville" do
    Church.create!(name: 'Église de Lyon', zipcode: '69001', town: 'Lyon')

    get '/api/churches', params: { search: 'Lyon' }, headers: @headers
    assert_response :success
    assert_equal ['Église de Lyon'], json['churches'].map { |c| c['name'] }
  end

  test "un responsable de région ne voit que ses associations dans l'espace région" do
    region = Region.create!(name: 'Ma région')
    @member.add_role :president, region

    get '/api/associations', params: { domain: 'region' }, headers: auth_headers(@member)
    assert_response :success
    assert_equal [], json['associations']
  end

  test "un responsable d'association la retrouve dans son espace" do
    association = structures(:association)
    @member.add_role :president, association

    get '/api/associations', params: { domain: 'association' }, headers: auth_headers(@member)
    assert_response :success
    assert_equal [association.id], json['associations'].map { |a| a['id'] }
  end

  test "une structure inconnue renvoie 404" do
    get '/api/churches/0', headers: @headers
    assert_response :not_found
  end
end
