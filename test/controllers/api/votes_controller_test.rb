require "test_helper"

class VotesControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:simple)
    sign_in @user
    @structure = structures(:association)
    @campaign = @structure.campaigns.create!(name: "Campaign")
  end

  test "user should have success response" do
    get api_vote_url(subdomain: nil, id: @campaign.id)
    assert_response :success

    # response is a json
    assert_match 'application/json', @response.media_type
    assert_match 'campaign', @response.body
  end

  test "as a user member of the association, I should have one voter" do
    @user.add_role :member, @structure
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.yesterday)
    @campaign.voting_tables.create!(position: 'Pasteur APE', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id)
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 1, response['voters'].length
  end

  test "as a president of church, I should have one voter" do
    church = structures(:church)
    @user.add_role :president, church

    church.add_role :member, @structure

    @campaign.voting_tables.create!(position: 'Eglises', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id)
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 1, response['voters'].length
  end


  test "as a president of association, I should have one voter" do
    association = structures(:association)
    @user.add_role :president, association

    association.add_role :member, @structure

    @campaign.voting_tables.create!(position: 'Oeuvres', voting: 'count', as_member: true)

    get api_vote_url(subdomain: nil, id: @campaign.id)
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

    get api_vote_url(subdomain: nil, id: @campaign.id)
    assert_response :success

    response = JSON.parse(@response.body)

    assert_equal 3, response['voters'].length
  end


end