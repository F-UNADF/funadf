require "test_helper"

class Intranet::PostsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get intranet_posts_index_url
    assert_response :success
  end

  test "should get show" do
    get intranet_posts_show_url
    assert_response :success
  end

  test "should get edit" do
    get intranet_posts_edit_url
    assert_response :success
  end

  test "should get create" do
    get intranet_posts_create_url
    assert_response :success
  end

  test "should get update" do
    get intranet_posts_update_url
    assert_response :success
  end

  test "should get delete" do
    get intranet_posts_delete_url
    assert_response :success
  end
end
