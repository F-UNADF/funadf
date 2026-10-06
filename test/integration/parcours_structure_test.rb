require "test_helper"

# Vie d'une structure : un admin la crée, y ajoute des membres et nomme un
# président ; ce président gère ensuite sa structure depuis son espace
# (membres, rôles, droit de vote, campagnes, actus, événements), sans
# déborder sur les autres structures.
class ParcoursStructureTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @admin_headers = auth_headers(@admin)
    @president = users(:simple)
    @pasteur = users(:other)
    @church = structures(:church)
    %w[member president secretary treasurer].each { |name| Role.find_or_create_by!(name: name) }
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def membership_of(structure, member)
    Membership.find_by(structure_id: structure.id, member_id: member.id, member_type: member.class.base_class.name)
  end

  test "association : création par l'admin, président nommé, gestion par le président" do
    # 1. L'admin crée l'association
    post '/api/associations', params: { association: { name: 'Œuvre Nouvelle', zipcode: '69001', town: 'Lyon', email: 'oeuvre@yopmail.com' } },
                              headers: @admin_headers
    assert_response :success
    association = Association.find(json['association']['id'])

    # 2. Il ajoute deux utilisateurs et une église ; un type inconnu est ignoré
    post "/api/associations/#{association.id}/members", params: { members: [
      { id: @president.id, type: 'User' }, { id: @pasteur.id, type: 'User' },
      { id: @church.id, type: 'Structure' }, { id: 1, type: 'Role' }
    ] }, headers: @admin_headers, as: :json
    assert_response :success
    assert_equal 3, json['members'].size
    assert json['members'].all? { |m| m['role_name'] == 'member' }

    # 3. Il nomme le président
    membership = membership_of(association, @president)
    post "/api/associations/#{association.id}/roles/edit",
         params: { member: { membership_id: membership.id }, role: 'president' }, headers: @admin_headers, as: :json
    assert_response :success
    assert_equal 'president', json['membership']['role_name']

    get '/api/associations', headers: @admin_headers
    row = json['associations'].find { |a| a['id'] == association.id }
    assert_equal @president.id, row['president']['id']

    # 4. Le président se connecte : il voit l'espace association
    post '/api/login', params: { email: @president.email, password: '123greetings' }
    headers = { 'Authorization' => "Bearer #{json['token']}" }

    get '/api/menus/me', headers: headers
    assert json.any? { |item| item['title'] == 'Association' }
    assert_not json.any? { |item| item['title'] == 'Admin' }

    get '/api/associations', params: { domain: 'association' }, headers: headers
    assert_equal [association.id], json['associations'].map { |a| a['id'] }

    get '/api/users', params: { domain: 'association' }, headers: headers
    assert_includes json['users'].map { |u| u['id'] }, @pasteur.id

    # 5. Il modifie sa fiche, nomme un secrétaire, bloque le vote d'un membre
    patch "/api/associations/#{association.id}", params: { association: { phone_1: '0400000000' } }, headers: headers
    assert_response :success
    assert_equal '0400000000', association.reload.phone_1

    pasteur_membership = membership_of(association, @pasteur)
    secretary = Role.find_by(name: 'secretary')
    patch "/api/memberships/#{pasteur_membership.id}", params: { membership: { role_id: secretary.id } }, headers: headers
    assert_response :success
    assert_equal secretary.id, pasteur_membership.reload.role_id

    post "/api/memberships/#{pasteur_membership.id}/toggleCanVote", headers: headers
    assert_response :success
    assert_equal false, pasteur_membership.reload.can_vote
    post "/api/memberships/#{pasteur_membership.id}/toggleCanVote", headers: headers
    assert_equal true, pasteur_membership.reload.can_vote

    # 6. Il prépare et ouvre une campagne de vote de son association
    post '/api/campaigns', params: { campaign: {
      name: 'AG', structure_id: association.id,
      motions: [{ name: 'Budget', kind: 'binary', order: 1 }],
      voting_tables: [{ position: 'Non renseigné', as_member: true, voting: 'count' }]
    } }, headers: headers, as: :json
    assert_response :success
    campaign = Campaign.find(json['campaign']['id'])

    get '/api/campaigns', params: { domain: 'association' }, headers: headers
    assert_equal [campaign.id], json['campaigns'].map { |c| c['id'] }

    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'opening' }, headers: headers
    assert_equal 'opened', campaign.reload.state

    # Le pasteur membre vote
    pasteur_headers = auth_headers(@pasteur)
    get '/api/votes', headers: pasteur_headers
    assert_includes json['campaigns'].map { |c| c['id'] }, campaign.id
    post '/api/votes', params: { campaign_id: campaign.id,
                                 voters: [{ resource_id: @pasteur.id, resource_type: 'User', selected: true }],
                                 results: [{ motion_id: campaign.motions.first.id, vote: 'Oui' }] },
                       headers: pasteur_headers, as: :json
    assert_response :success

    get "/api/campaigns/#{campaign.id}/voters_count", headers: headers
    assert_equal 1, json['voters_count']

    get "/api/campaigns/#{campaign.id}", headers: headers
    assert_equal 1, json['results'].first['non_consultative_yes_count'].to_i

    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'close_definitly' }, headers: headers
    assert_equal 'closed', campaign.reload.state

    # 7. Il publie une actu et un événement pour son association
    post '/api/posts', params: { post: { title: 'Bienvenue', content: 'Texte', structure_id: association.id,
                                         published_at: Time.current, accesses: { '0' => { value: 'Non renseigné' } } } },
                       headers: headers
    assert_response :success
    get '/api/posts', params: { domain: 'association' }, headers: headers
    assert_equal ['Bienvenue'], json['posts'].map { |p| p['title'] }

    post '/api/events', params: { event: { title: 'Congrès', structure_id: association.id, category: 'Congrès',
                                           start_at: 1.day.from_now, end_at: 2.days.from_now,
                                           accesses: { '0' => 'Non renseigné' } } }, headers: headers
    assert_response :success
    get '/api/events', params: { domain: 'association' }, headers: headers
    assert_equal ['Congrès'], json['events'].map { |e| e['title'] }

    # Le pasteur, membre de l'association, voit l'actu dans son fil
    get '/api/feed', headers: pasteur_headers
    assert_equal ['Bienvenue'], json['posts'].map { |p| p['title'] }

    # 8. Il retire un membre (l'église) puis ne peut rien sur une autre association
    church_membership = membership_of(association, @church)
    delete "/api/memberships/#{church_membership.id}", headers: headers
    assert_response :success
    assert_equal 2, json['members'].size

    other = structures(:association)
    patch "/api/associations/#{other.id}", params: { association: { name: 'Pirate' } }, headers: headers
    assert_response :forbidden
    post "/api/associations/#{other.id}/members", params: { members: [{ id: @pasteur.id, type: 'User' }] }, headers: headers, as: :json
    assert_response :forbidden
    delete "/api/associations/#{association.id}", headers: headers
    assert_response :forbidden, "seul un admin supprime une structure"

    # 9. L'admin destitue le président : il perd l'espace association
    post "/api/associations/#{association.id}/roles/edit",
         params: { member: { membership_id: membership.id }, role: 'member' }, headers: @admin_headers, as: :json
    get '/api/associations', params: { domain: 'association' }, headers: headers
    assert_equal [], json['associations']
    patch "/api/associations/#{association.id}", params: { association: { name: 'Trop tard' } }, headers: headers
    assert_response :forbidden
  end

  test "région : président nommé par l'admin, gestion des membres et contenus de la région" do
    post '/api/regions', params: { region: { name: 'Région Sud', town: 'Marseille' } }, headers: @admin_headers
    region = Region.find(json['region']['id'])

    post "/api/regions/#{region.id}/members", params: { members: [{ id: @president.id, type: 'User' }, { id: @pasteur.id, type: 'User' }] },
                                              headers: @admin_headers, as: :json
    membership = membership_of(region, @president)
    post "/api/regions/#{region.id}/roles/edit", params: { member: { membership_id: membership.id }, role: 'president' },
                                                 headers: @admin_headers, as: :json
    assert_response :success

    headers = auth_headers(@president)
    get '/api/current_user', headers: headers
    assert_equal region.id, json['region']['id']

    get '/api/menus/me', headers: headers
    assert json.any? { |item| item['title'] == 'Region' }
    get '/api/menus/region', headers: headers
    assert json.any? { |item| item['title'] == 'Membres' }

    get '/api/users', params: { domain: 'region' }, headers: headers
    assert_includes json['users'].map { |u| u['id'] }, @pasteur.id

    patch "/api/regions/#{region.id}", params: { region: { phone_1: '0491000000' } }, headers: headers
    assert_response :success

    pasteur_membership = membership_of(region, @pasteur)
    post "/api/regions/#{region.id}/roles/edit", params: { member: { membership_id: pasteur_membership.id }, role: 'treasurer' },
                                                 headers: headers, as: :json
    assert_response :success
    assert_equal 'treasurer', pasteur_membership.reload.role.name

    # Référentiels des formulaires de l'espace région : ses structures seulement
    %w[campaigns events posts].each do |referentiel|
      get "/api/referentiels/#{referentiel}", params: { domain: 'region' }, headers: headers
      assert_equal [region.id], json['structures'].map { |s| s['id'] }, referentiel
    end

    post '/api/campaigns', params: { campaign: { name: 'Synode', structure_id: region.id, motions: [], voting_tables: [] } },
                           headers: headers, as: :json
    get '/api/campaigns', params: { domain: 'region' }, headers: headers
    assert_equal ['Synode'], json['campaigns'].map { |c| c['name'] }

    post '/api/posts', params: { post: { title: 'Actu région', content: 'x', structure_id: region.id } }, headers: headers
    get '/api/posts', params: { domain: 'region' }, headers: headers
    assert_equal ['Actu région'], json['posts'].map { |p| p['title'] }

    post '/api/events', params: { event: { title: 'Pastorale', structure_id: region.id, category: 'Pastorale',
                                           start_at: 1.day.from_now, end_at: 2.days.from_now, accesses: { '0' => 'Non renseigné' } } },
                        headers: headers
    get '/api/events', params: { domain: 'region' }, headers: headers
    assert_equal ['Pastorale'], json['events'].map { |e| e['title'] }

    # Un responsable de région ne publie pas pour une structure hors de sa région
    post '/api/events', params: { event: { title: 'Ailleurs', structure_id: structures(:association).id, category: 'X',
                                           start_at: 1.day.from_now, end_at: 2.days.from_now, accesses: {} } }, headers: headers
    assert_response :forbidden

    delete "/api/regions/#{region.id}", headers: headers
    assert_response :forbidden
    delete "/api/regions/#{region.id}", headers: @admin_headers
    assert_response :success
    assert_not Region.exists?(region.id)
  end

  test "église : l'admin ajoute un pasteur, le nomme président, puis le retire" do
    post "/api/churches/#{@church.id}/members", params: { members: [{ id: @pasteur.id, type: 'User' }] }, headers: @admin_headers, as: :json
    membership = membership_of(@church, @pasteur)

    post "/api/churches/#{@church.id}/roles/edit", params: { member: { membership_id: membership.id }, role: 'president' },
                                                   headers: @admin_headers, as: :json
    assert_response :success

    get '/api/churches', headers: @admin_headers
    assert_equal @pasteur.id, json['churches'].find { |c| c['id'] == @church.id }['president']['id']

    get '/api/profile', headers: auth_headers(@pasteur)
    assert_equal [@church.id], json['presidences'].map { |s| s['id'] }
    assert_equal 'Church', json['presidences'].first['mtype']

    delete "/api/churches/#{@church.id}/members/#{membership.id}", headers: @admin_headers
    assert_response :success
    assert_equal [], json['members']
  end
end
