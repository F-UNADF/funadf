require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  
  def setup
    @user = users(:simple)
    sign_in @user
  end

  test "root should redirect to users" do
    @user.add_role(:admin)
    get admin_root_url(subdomain: 'admin')
    assert_response :redirect
  end

  test "user without admin role should be redirect to me subdomain" do
    get admin_users_url(subdomain: 'admin')
    assert_response :redirect
  end
end
