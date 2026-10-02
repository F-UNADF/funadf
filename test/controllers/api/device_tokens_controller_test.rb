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
    other = DeviceToken.create!(token: "fcm:autre-utilisateur", platform: 'mobile', user: users(:other))

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

  test "create rattache le jeton à l'utilisateur connecté, pas au user_id envoyé" do
    post api_device_tokens_url(subdomain: nil),
      params: { token: "fcm:nouveau", platform: 'mobile', user_id: users(:other).id },
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    assert_equal @user.id, DeviceToken.find_by(token: "fcm:nouveau").user_id
  end

  test "create sans user_id fonctionne (rétrocompatibilité)" do
    post api_device_tokens_url(subdomain: nil),
      params: { token: "fcm:sans-user-id", platform: 'web' },
      headers: { 'Authorization' => @current_api_token }
    assert_response :success

    assert_equal @user.id, DeviceToken.find_by(token: "fcm:sans-user-id").user_id
  end
end
