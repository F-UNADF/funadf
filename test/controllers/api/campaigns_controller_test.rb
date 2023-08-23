require 'test_helper'

class Api::CampaignsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @campaign = campaigns(:one)
  end

  test "should get index" do
    get api_campaigns_url
    assert_response :success
    assert_equal Campaign.count, JSON.parse(response.body)["campaigns"].size
  end

  test "should show campaign" do
    get api_campaign_url(@campaign)
    assert_response :success
    response_body = JSON.parse(response.body)
    assert_equal @campaign.name, response_body["campaign"]["name"]
    assert_equal @campaign.motions.count, response_body["motions"].size
  end

  test "should create campaign" do
    assert_difference('Campaign.count') do
      post api_campaigns_url, params: { campaign: { name: "New Campaign", structure_id: 1 } }, as: :json
    end
    assert_response :success
    assert_equal "New Campaign", JSON.parse(response.body)["campaign"]["name"]
  end

  test "should update campaign" do
    motion_params = [
      { id: @campaign.motions.first.id, name: "Updated Motion 1", kind: "binary", order: 0 },
      { name: "New Motion", kind: "neutral", order: 1 }
    ]
    assert_no_difference('Campaign.count') do
      patch api_campaign_url(@campaign), params: { campaign: { name: "Updated Campaign", motions: motion_params } }, as: :json
    end
    assert_response :success
    @campaign.reload
    assert_equal "Updated Campaign", @campaign.name
    assert_equal "Updated Motion 1", @campaign.motions.first.name
    assert_equal "New Motion", @campaign.motions.last.name
  end

  test "should destroy campaign" do
    assert_difference('Campaign.count', -1) do
      delete api_campaign_url(@campaign)
    end
    assert_response :success
  end
end
