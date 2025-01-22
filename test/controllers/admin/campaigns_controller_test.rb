require "test_helper"

class CampaignsControllerTest < ActionDispatch::IntegrationTest
  
  def setup
    @user = users(:simple)
    sign_in @user
  end

  test "should get index" do
    @user.add_role(:admin)
    get admin_campaigns_url(subdomain: 'admin')
    assert_response :success
  end

  test "user without admin role should not get index" do
    get admin_campaigns_url(subdomain: 'admin')
    assert_response :redirect
  end
end
