require "test_helper"

# Écrans d'administration : cas d'erreur et branches restantes (campagnes,
# cotisations, notifications push, rôles, appareils, menus, référentiels,
# configuration des écrans, gestion des utilisateurs).
class Api::AdminEdgeTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @headers = auth_headers(@admin)
    @member = users(:simple)
    @other = users(:other)
    @association = structures(:association)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  # ---------- Campagnes ----------

  test "campagnes : liste vide hors espace de gestion, et pour un responsable sans structure" do
    get '/api/campaigns', headers: @headers
    assert_equal [], json['campaigns']
    get '/api/campaigns', params: { domain: 'region' }, headers: auth_headers(@member)
    assert_equal [], json['campaigns']
    get '/api/campaigns', params: { domain: 'admin' }, headers: auth_headers(@member)
    assert_response :forbidden
  end

  test "campagnes : modification sans structure refusée, déplacement hors périmètre interdit" do
    campaign = campaigns(:one)
    patch "/api/campaigns/#{campaign.id}", params: { campaign: { structure_id: '', motions: [], voting_tables: [] } },
                                           headers: @headers, as: :json
    assert_equal 422, json['status']
    assert json['errors'].key?('structure_id')

    @member.add_role :president, @association
    patch "/api/campaigns/#{campaign.id}", params: { campaign: { structure_id: Association.create!(name: 'Autre').id, motions: [], voting_tables: [] } },
                                           headers: auth_headers(@member), as: :json
    assert_response :forbidden
    assert_equal @association.id, campaign.reload.structure_id
  end

  test "campagnes : un événement d'état inconnu est refusé" do
    campaign = campaigns(:one)
    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'opening' }, headers: @headers
    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'opening' }, headers: @headers
    assert_equal 422, json['status']
    assert_equal 'opened', campaign.reload.state
  end

  test "campagnes : l'estimation ignore les lignes mal formées de la table des votes" do
    post '/api/campaigns/electorate', params: { structure_id: @association.id, voting_tables: ['n importe quoi', { position: 'Pasteur APE', as_member: true, voting: 'count' }] },
                                      headers: @headers, as: :json
    assert_response :success
    assert json.key?('members')
  end

  test "campagne inconnue : 404" do
    get '/api/campaigns/999999', headers: @headers
    assert_response :not_found
  end

  # ---------- Cotisations, push, rôles ----------

  test "cotisations : liste complète sans recherche, modification invalide refusée" do
    fee = Fee.create!(what: '2025', amount: 50, paid_at: Date.new(2025, 1, 1), member: @member)
    get '/api/fees', headers: @headers
    assert_equal [fee.id], json['fees'].map { |f| f['id'] }

    patch "/api/fees/#{fee.id}", params: { fee: { what: '' } }, headers: @headers
    assert_equal 422, json['status']
    assert_equal '2025', fee.reload.what
  end

  test "notifications push : modification invalide refusée, suppression" do
    push = PushNotification.create!(title: 'Titre', body: 'Corps')
    patch "/api/push_notifications/#{push.id}", params: { push_notification: { title: '' } }, headers: @headers
    assert_response :unprocessable_entity
    assert json['errors'].any?

    patch "/api/push_notifications/#{push.id}", params: { push_notification: { title: 'Nouveau' } }, headers: @headers
    assert_response :success
    assert_equal 'Nouveau', push.reload.title

    delete "/api/push_notifications/#{push.id}", headers: @headers
    assert_response :no_content
    assert_not PushNotification.exists?(push.id)
  end

  test "rôles : renommer vers un nom déjà pris est refusé, rôle inconnu en 404" do
    Role.find_or_create_by!(name: 'secretary')
    role = Role.create!(name: 'temporaire')
    patch "/api/roles/#{role.id}", params: { role: { name: 'secretary' } }, headers: @headers
    assert_response :unprocessable_entity
    assert_equal 'temporaire', role.reload.name

    get '/api/roles/999999', headers: @headers
    assert_response :not_found
  end

  # ---------- Appareils ----------

  test "enregistrement d'un appareil sans jeton refusé" do
    post '/api/device_tokens', params: { token: '', platform: 'mobile' }, headers: auth_headers(@member)
    assert_response :unprocessable_entity
    assert_equal 'error', json['status']
  end

  # ---------- Menus, référentiels, configuration ----------

  test "menu inconnu" do
    get '/api/menus/inconnu', headers: auth_headers(@member)
    assert_response :success
    assert_equal 'Menu inconnu not found', json['error']
  end

  test "référentiel inconnu, référentiels d'un responsable d'association" do
    get '/api/referentiels/inconnu', headers: auth_headers(@member)
    assert_equal 'Invalid referentiel inconnu', json['error']

    @member.add_role :president, @association
    headers = auth_headers(@member)
    %w[campaigns events posts].each do |referentiel|
      get "/api/referentiels/#{referentiel}", params: { domain: 'association' }, headers: headers
      assert_equal [@association.id], json['structures'].map { |s| s['id'] }, referentiel
    end

    get '/api/referentiels/fees', headers: headers
    assert_response :forbidden
  end

  test "menu admin demandé par un membre : seulement la navigation" do
    get '/api/menus/admin', headers: auth_headers(@member)
    assert_equal ['ADMIN', 'NAVIGATION', nil], json.map { |item| item['header'] }
    assert_equal ['Mon espace'], json.map { |item| item['title'] }.compact
  end

  test "référentiels des formulaires de l'espace admin : toutes les associations" do
    get '/api/referentiels/events', params: { domain: 'admin' }, headers: @headers
    assert_equal Association.count, json['structures'].size
    get '/api/referentiels/posts', params: { domain: 'admin' }, headers: @headers
    assert_equal Association.count + Region.count, json['structures'].size
  end

  test "référentiels des structures : rôles attribuables et membres possibles" do
    Role.find_or_create_by!(name: 'president')
    %w[churches regions associations].each do |referentiel|
      get "/api/referentiels/#{referentiel}", headers: @headers
      assert_response :success
      assert_not_includes json['roles'].map { |r| r['name'] }, 'admin', referentiel
      assert_includes json['members'].map { |m| [m['member_type'], m['member_id']] }, ['User', @member.id]
      assert_includes json['members'].map { |m| [m['member_type'], m['member_id']] }, ['Structure', @association.id]
    end
  end

  test "configuration d'un écran inconnu : erreur" do
    assert_raises(RuntimeError) { get '/api/inconnu/config', headers: @headers }
  end

  # ---------- Utilisateurs ----------

  test "utilisateurs : espace inconnu, liste vide" do
    get '/api/users', params: { domain: 'inconnu' }, headers: @headers
    assert_response :success
    assert_equal [], json['users']
  end

  test "un admin modifie un utilisateur sans toucher à son parcours" do
    @other.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2020, 1, 1))
    patch "/api/users/#{@other.id}", params: { user: { user: { town: 'Nantes' } } }, headers: @headers
    assert_response :success
    assert_equal 'Nantes', @other.reload.town
    assert_equal 1, @other.gratitudes.count
  end

  test "un admin modifie les fonctions et responsabilités existantes" do
    church = structures(:church)
    phase = @other.phases.create!(church_id: church.id, function: 'Pasteur', start_at: Date.new(2020, 1, 1))
    responsability = @other.responsabilities.create!(association_id: @association.id, function: 'Trésorier', start_at: Date.new(2021, 1, 1))

    patch "/api/users/#{@other.id}", params: { user: {
      user: { firstname: 'Other' },
      phases: { '0' => { id: phase.id, church_id: church.id, function: 'Pasteur principal', start_at: '2020-01-01', end_at: '2024-12-31' } },
      responsabilities: { '0' => { id: responsability.id, association_id: @association.id, function: 'Président', start_at: '2021-01-01' } }
    } }, headers: @headers
    assert_response :success
    assert_equal 'Pasteur principal', phase.reload.function
    assert_equal Date.new(2024, 12, 31), phase.end_at
    assert_equal 'Président', responsability.reload.function
  end

  test "un modérateur modifie le profil d'un membre" do
    @other.add_role :moderator
    patch "/api/users/#{@member.id}", params: { user: { user: { town: 'Brest' } } }, headers: auth_headers(@other)
    assert_response :success
    assert_equal 'Brest', @member.reload.town
  end

  test "retirer un rôle que l'utilisateur n'a pas ne casse rien" do
    patch "/api/users/#{@other.id}/remove_role", params: { role: 'moderator' }, headers: @headers
    assert_response :success
    assert_equal [], @other.reload.application_roles
  end

  test "la fiche d'un autre membre ne montre pas ses cotisations, la sienne oui" do
    Fee.create!(what: '2025', amount: 50, paid_at: Date.new(2025, 1, 1), member: @member)
    get "/api/users/#{@member.id}", headers: auth_headers(@other)
    assert_equal [], json['fees']
    get "/api/users/#{@member.id}", headers: auth_headers(@member)
    assert_equal 1, json['fees'].size
  end

  test "utilisateur inconnu : 404" do
    get '/api/users/999999', headers: @headers
    assert_response :not_found
    patch '/api/users/999999/enable', headers: @headers
    assert_response :not_found
  end
end
