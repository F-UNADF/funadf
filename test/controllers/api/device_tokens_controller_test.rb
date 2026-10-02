require "test_helper"

class DeviceTokensControllerTest < ActionDispatch::IntegrationTest

  def setup
    @user = users(:simple)
    api_token = @user.api_tokens.create!(token: "123456", active: true)

    @current_api_token = "Bearer #{api_token.token}"
    @fcm_token = "fcm:APA91b-token_de_test"
    @user.device_tokens.create!(token: @fcm_token, platform: 'mobile')
  end

  test "destroy removes the current user's token passed as param" do
    delete api_device_token_url(subdomain: nil, id: 'current', token: @fcm_token),
      headers: { 'Authorization' => @current_api_token }
    assert_response :no_content

    assert_not DeviceToken.exists?(token: @fcm_token)
  end

  test "destroy is idempotent" do
    delete api_device_token_url(subdomain: nil, id: 'current', token: 'jeton-inconnu'),
      headers: { 'Authorization' => @current_api_token }
    assert_response :no_content

    assert DeviceToken.exists?(token: @fcm_token)
  end

  test "destroy does not remove another user's token" do
    other = DeviceToken.new(token: "fcm:autre-utilisateur", platform: 'mobile', user_id: @user.id + 1000)
    other.save!(validate: false)

    delete api_device_token_url(subdomain: nil, id: 'current', token: other.token),
      headers: { 'Authorization' => @current_api_token }
    assert_response :no_content

    assert DeviceToken.exists?(token: other.token)
  end

  test "destroy requires authentication" do
    delete api_device_token_url(subdomain: nil, id: 'current', token: @fcm_token)
    assert_response :unauthorized

    assert DeviceToken.exists?(token: @fcm_token)
  end
end
