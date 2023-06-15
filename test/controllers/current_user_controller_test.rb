require "test_helper"

class CurrentUserControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get current_user_show_url
    assert_response :success
  end
end
