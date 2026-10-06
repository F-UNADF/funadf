require "test_helper"

# POST /api/votes : cas limites (campagne retrouvée par la résolution, campagne
# inconnue, électeur non coché, second envoi, résolution inconnue).
class Api::VotesEdgeTest < ActionDispatch::IntegrationTest
  def setup
    @user = users(:simple)
    @headers = auth_headers(@user)
    @association = structures(:association)
    @campaign = Campaign.create!(name: 'AG', structure: @association, state: 'opened')
    @campaign.voting_tables.create!(position: 'Non renseigné', voting: 'count', as_member: true)
    @motion = @campaign.motions.create!(name: 'Budget', kind: 'binary', order: 1)
    @user.add_role :member, @association
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def me(selected: true)
    [{ resource_id: @user.id, resource_type: 'User', selected: selected }]
  end

  test "sans campaign_id, la campagne est retrouvée par la résolution" do
    post '/api/votes', params: { voters: me, results: [{ motion_id: @motion.id, vote: 'Non' }] }, headers: @headers, as: :json
    assert_response :success
    assert_equal ['Non'], Vote.where(motion_id: @motion.id).pluck(:result)
  end

  test "campagne introuvable : 404" do
    post '/api/votes', params: { voters: me, results: [{ motion_id: 0, vote: 'Oui' }] }, headers: @headers, as: :json
    assert_response :not_found
    assert_equal 'Campaign not found', json['error']

    post '/api/votes', params: { campaign_id: 999999, voters: me, results: [] }, headers: @headers, as: :json
    assert_response :not_found
  end

  test "un électeur non coché ne vote pas, un second envoi ne compte pas" do
    post '/api/votes', params: { campaign_id: @campaign.id, voters: me(selected: false), results: [{ motion_id: @motion.id, vote: 'Oui' }] },
                       headers: @headers, as: :json
    assert_response :success
    assert_equal 0, Voter.count

    2.times do
      post '/api/votes', params: { campaign_id: @campaign.id, voters: me(selected: 'true'), results: [{ motion_id: @motion.id, vote: 'Oui' }, { motion_id: 0, vote: 'Oui' }] },
                         headers: @headers, as: :json
    end
    assert_equal 1, Voter.where(motion_id: @motion.id).count
    assert_equal 1, Vote.where(motion_id: @motion.id).count
  end

  test "la même résolution envoyée deux fois dans un bulletin ne compte qu'une voix" do
    post '/api/votes', params: { campaign_id: @campaign.id, voters: me,
                                 results: [{ motion_id: @motion.id, vote: 'Oui' }, { motion_id: @motion.id, vote: 'Non' }] },
                       headers: @headers, as: :json
    assert_response :success
    assert_equal ['Oui'], Vote.where(motion_id: @motion.id).pluck(:result)
  end

  test "un vote sans authentification est refusé" do
    post '/api/votes', params: { campaign_id: @campaign.id, voters: me, results: [] }, as: :json
    assert_response :unauthorized
  end

  test "un choix multiple ignore les choix en double" do
    choices = @campaign.motions.create!(name: 'Élection', kind: 'choices', order: 3, choices: 'A,B', max_choice: 2)
    post '/api/votes', params: { campaign_id: @campaign.id, voters: me, results: [{ motion_id: choices.id, vote: ['A', 'A', 'B'] }] },
                       headers: @headers, as: :json
    assert_equal %w[A B], Vote.where(motion_id: choices.id).pluck(:result).sort
  end
end
