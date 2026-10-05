require "test_helper"

# Campagnes de vote côté organisateur : préparation (résolutions, tableau des
# votants), ouverture et clôture, dépouillement, liste par espace.
class Api::CampaignsAdminTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @headers = auth_headers(@admin)
    @association = structures(:association)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  test "un admin prépare une campagne puis modifie ses résolutions et son tableau des votants" do
    post '/api/campaigns', params: { campaign: {
      name: 'AG 2026', structure_id: @association.id,
      motions: [{ name: 'Rapport moral', kind: 'binary', order: 1 },
                { name: 'Élection', kind: 'choices', order: 2, choices: 'A,B,C', max_choice: 2 }],
      voting_tables: [{ position: 'Pasteur APE', as_member: true, voting: 'count' }]
    } }, headers: @headers, as: :json
    assert_response :success
    assert_equal 200, json['status']

    campaign = Campaign.find(json['campaign']['id'])
    assert_equal 'coming', campaign.state
    assert_equal ['Rapport moral', 'Élection'], campaign.motions.map(&:name)
    assert_equal 1, campaign.voting_tables.count

    kept = campaign.motions.first
    table = campaign.voting_tables.first
    patch "/api/campaigns/#{campaign.id}", params: { campaign: {
      name: 'AG 2026 (report)',
      motions: [{ id: kept.id, name: 'Rapport moral et financier', kind: 'binary', order: 1 },
                { name: 'Question libre', kind: 'free', order: 2 }],
      voting_tables: [{ id: table.id, position: 'Pasteur APE', as_member: true, voting: 'consultative' }]
    } }, headers: @headers, as: :json
    assert_response :success

    campaign.reload
    assert_equal 'AG 2026 (report)', campaign.name
    assert_equal ['Rapport moral et financier', 'Question libre'], campaign.motions.map(&:name)
    assert_equal 'consultative', table.reload.voting
  end

  test "une campagne sans structure est refusée" do
    post '/api/campaigns', params: { campaign: { name: 'Orpheline', motions: [], voting_tables: [] } },
      headers: @headers, as: :json
    assert_equal 422, json['status']
    assert json['errors'].key?('structure_id')
  end

  test "ouverture, fermeture temporaire puis clôture définitive" do
    campaign = @association.campaigns.create!(name: 'AG')

    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'opening' }, headers: @headers
    assert_equal 'opened', campaign.reload.state
    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'close_temporarily' }, headers: @headers
    assert_equal 'coming', campaign.reload.state
    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'close_definitly' }, headers: @headers
    assert_equal 'closed', campaign.reload.state

    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'opening' }, headers: @headers
    assert_equal 422, json['status']
    assert_equal 'closed', campaign.reload.state
  end

  test "le dépouillement compte les voix par résolution et par choix" do
    campaign = @association.campaigns.create!(name: 'AG', state: 'opened')
    binary  = campaign.motions.create!(name: 'Rapport', kind: 'binary', order: 1)
    choices = campaign.motions.create!(name: 'Élection', kind: 'choices', choices: 'A,B', max_choice: 1, order: 2)
    free    = campaign.motions.create!(name: 'Idées', kind: 'free', order: 3)
    church  = structures(:church)

    [users(:simple), users(:other)].each_with_index do |user, i|
      binary.voters.create!(resource: user, voted_at: Time.current, ip: '127.0.0.1')
      binary.votes.create!(result: i.zero? ? 'Oui' : 'Non', is_consultative: false)
      choices.votes.create!(result: 'A', is_consultative: false)
      free.votes.create!(result: "Idée #{i}", is_consultative: false)
    end
    binary.voters.create!(resource: church, voted_at: Time.current, ip: '127.0.0.1')

    get "/api/campaigns/#{campaign.id}", headers: @headers
    assert_response :success

    rapport = json['results'].find { |r| r['motion_name'] == 'Rapport' }
    assert_equal 1, rapport['non_consultative_yes_count'].to_i
    assert_equal 1, rapport['non_consultative_no_count'].to_i
    assert_equal [['A', 2]], json['choices_results'].map { |r| [r['choice'], r['count']] }
    assert_equal 'Idée 0, Idée 1', json['free_results'].first['non_consultative_free']
    assert_equal 3, json['voters'].size
    assert_equal 3, json['motions'].size

    get "/api/campaigns/#{campaign.id}/voters_count", headers: @headers
    assert_response :success
    assert_equal 3, json['voters_count']
  end

  test "liste admin et liste d'un responsable" do
    mine   = @association.campaigns.create!(name: 'Mienne')
    theirs = Association.create!(name: 'Autre').campaigns.create!(name: 'Autre')
    president = users(:simple)
    president.add_role :president, @association

    get '/api/campaigns', params: { domain: 'admin' }, headers: @headers
    assert_response :success
    assert_equal [theirs.id, mine.id, campaigns(:one).id], json['campaigns'].map { |c| c['id'] }
    assert_equal 'Business One', json['campaigns'].second['structure_name']

    get '/api/campaigns', params: { domain: 'association' }, headers: auth_headers(president)
    assert_equal [mine.id, campaigns(:one).id], json['campaigns'].map { |c| c['id'] }

    get '/api/campaigns', params: { domain: 'region' }, headers: auth_headers(president)
    assert_equal [], json['campaigns']
  end

  test "un admin supprime une campagne et ses résolutions" do
    campaign = @association.campaigns.create!(name: 'AG')
    motion = campaign.motions.create!(name: 'Rapport', kind: 'binary', order: 1)

    delete "/api/campaigns/#{campaign.id}", headers: @headers
    assert_response :success
    assert_not Campaign.exists?(campaign.id)
    assert_not Motion.exists?(motion.id)
  end

  # ---------- PDF des résultats ----------

  test "PDF des résultats : admin et responsable de la structure seulement" do
    campaign = @association.campaigns.create!(name: 'AG')
    campaign.motions.create!(name: 'Rapport', kind: 'binary', order: 1)

    get "/api/campaigns/#{campaign.id}/results", headers: @headers
    assert_response :success
    assert_equal 'application/pdf', @response.media_type
    assert @response.body.start_with?('%PDF')

    president = users(:other)
    president.add_role :president, @association
    get "/api/campaigns/#{campaign.id}/results", headers: auth_headers(president)
    assert_response :success

    get "/api/campaigns/#{campaign.id}/results", headers: auth_headers(users(:simple))
    assert_response :forbidden

    get "/api/campaigns/#{campaign.id}/results"
    assert_response :unauthorized
  end
end

