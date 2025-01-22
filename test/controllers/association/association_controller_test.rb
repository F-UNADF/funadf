require "test_helper"

class AssociationControllerTest < ActionDispatch::IntegrationTest
  
  def setup
    @user = users(:simple)
    sign_in @user
  end

  test "user with responsabilities should have a ok response" do
    association = associations(:one)
    @user.add_role :president, association

    get association_campaigns_url(subdomain: 'association')
    assert_response :success
  end

  test "root should redirect to campaigns" do
    get association_root_url(subdomain: 'association')
    assert_response :redirect
  end

  test "user without responsabilities should be redirect to me subdomain" do
    get association_campaigns_url(subdomain: 'association')
    assert_response :redirect
  end
end