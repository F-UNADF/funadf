require "test_helper"

class VotesControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:simple)
    api_token = @user.api_tokens.create!(token: "123456", active: true)

    @current_api_token = "Bearer #{api_token.token}"
    @structure = structures(:association)
    @campaign = @structure.campaigns.create!(name: "Campaign")
  end

  test "user should have success response" do
    get api_vote_url(subdomain: nil, id: @campaign.id),
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    # response is a json
    assert_match 'application/json', @response.media_type
    assert_match 'campaign', @response.body
  end

  test "as a user member of the association, I should have one voter" do
    @user.add_role :member, @structure
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.yesterday)
    @campaign.voting_tables.create!(position: 'Pasteur APE', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id),
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 1, response['voters'].length
  end

  test "as a president of church, I should have one voter" do
    church = structures(:church)
    @user.add_role :president, church

    church.add_role :member, @structure

    @campaign.voting_tables.create!(position: 'Eglises', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id),
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 1, response['voters'].length
  end


  test "as a president of association, I should have one voter" do
    association = structures(:association)
    @user.add_role :president, association

    association.add_role :member, @structure

    @campaign.voting_tables.create!(position: 'Oeuvres', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id),
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 1, response['voters'].length
  end

  test "I could have many voters" do
    church = structures(:church)
    @user.add_role :president, church

    association = structures(:association)
    @user.add_role :president, association

    church.add_role :member, @structure
    association.add_role :member, @structure
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.yesterday)
    @user.add_role :member, @structure

    @campaign.voting_tables.create!(position: 'Pasteur APE', voting: 'count', as_member: true)
    @campaign.voting_tables.create!(position: 'Eglises', voting: 'count', as_member: true)
    @campaign.voting_tables.create!(position: 'Oeuvres', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id),
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 3, response['voters'].length
  end



  # ---------- POST /api/votes : intégrité du scrutin ----------

  def open_campaign_for_member(voting: 'count')
    @user.add_role :member, @structure
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.yesterday)
    @campaign.voting_tables.create!(position: 'Pasteur APE', voting: voting, as_member: true)
    @motion = @campaign.motions.create!(name: 'Rapport moral', kind: 'binary', order: 1)
    @campaign.update!(state: 'opened')
  end

  def cast(voters, results)
    post api_votes_url(subdomain: nil), params: { campaign_id: @campaign.id, voters: voters, results: results },
      headers: { 'Authorization' => @current_api_token }, as: :json
  end

  test "un électeur vote une fois pour lui-même" do
    open_campaign_for_member

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: @motion.id, vote: 'Oui' }])
    assert_response :success

    assert_equal 1, Voter.where(motion_id: @motion.id, resource_id: @user.id, resource_type: 'User').count
    assert_equal ['Oui'], Vote.where(motion_id: @motion.id).pluck(:result)
  end

  test "on ne peut pas voter au nom d'un autre membre ou d'une structure qu'on ne préside pas" do
    open_campaign_for_member
    other = users(:other)
    other.add_role :member, @structure
    church = structures(:church)
    church.add_role :member, @structure
    @campaign.voting_tables.create!(position: 'Eglises', voting: 'count', as_member: true)

    cast([{ resource_id: other.id, resource_type: 'User', selected: true, is_consultative: 0 },
          { resource_id: church.id, resource_type: 'Structure', selected: true, is_consultative: 0 }],
         [{ motion_id: @motion.id, vote: 'Non' }])

    assert_equal 0, Voter.where(motion_id: @motion.id).count
    assert_equal 0, Vote.where(motion_id: @motion.id).count
  end

  test "un bulletin oui/non ne compte qu'une voix" do
    open_campaign_for_member

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: @motion.id, vote: %w[Oui Oui Oui Oui Oui] }])

    assert_equal 1, Vote.where(motion_id: @motion.id).count
  end

  test "un choix multiple ne dépasse pas le nombre de choix autorisés" do
    open_campaign_for_member
    motion = @campaign.motions.create!(name: 'Élection', kind: 'choices', choices: 'A,B,C', max_choice: 2, order: 2)

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: motion.id, vote: %w[A A B C] }])

    assert_equal %w[A B], Vote.where(motion_id: motion.id).pluck(:result).sort
  end

  test "le caractère consultatif est fixé par le serveur, pas par le client" do
    open_campaign_for_member(voting: 'consultative')

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: @motion.id, vote: 'Oui' }])

    assert_equal [true], Vote.where(motion_id: @motion.id).pluck(:is_consultative)
  end

  test "on ne vote pas dans une campagne qui n'est pas ouverte" do
    open_campaign_for_member
    @campaign.update!(state: 'coming')

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: @motion.id, vote: 'Oui' }])
    assert_response :unprocessable_entity

    assert_equal 0, Vote.where(motion_id: @motion.id).count
  end

  test "on ne vote pas sur une résolution d'une autre campagne" do
    open_campaign_for_member
    other_campaign = structures(:church).campaigns.create!(name: 'Autre', state: 'opened')
    other_motion = other_campaign.motions.create!(name: 'Hors campagne', kind: 'binary', order: 1)

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: other_motion.id, vote: 'Oui' }])

    assert_equal 0, Vote.where(motion_id: other_motion.id).count
  end

  test "un électeur sans droit de vote ne peut pas voter" do
    open_campaign_for_member
    Membership.where(member: @user, structure: @structure).update_all(can_vote: false)

    cast([{ resource_id: @user.id, resource_type: 'User', selected: true, is_consultative: 0 }],
         [{ motion_id: @motion.id, vote: 'Oui' }])

    assert_equal 0, Vote.where(motion_id: @motion.id).count
  end

end
