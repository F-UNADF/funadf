require "test_helper"
require "minitest/mock"

# Envoi d'un push par l'API HTTP v1 de FCM (sans appel réseau).
class FcmNotificationServiceTest < ActiveSupport::TestCase
  Response = Struct.new(:status, :body)

  def setup
    credentials = Object.new
    def credentials.fetch_access_token! = { 'access_token' => 'jeton-oauth' }
    Google::Auth::ServiceAccountCredentials.stub(:make_creds, credentials) do
      @service = FcmNotificationService.new(file_fixture('fcm_credential.json'))
    end
  end

  def deliver(response, **args)
    request = Struct.new(:headers, :body).new({}, nil)
    url = nil
    fake_post = lambda do |target, &block|
      url = target
      block.call(request)
      response.is_a?(Exception) ? raise(response) : response
    end
    result = Faraday.stub(:post, fake_post) do
      @service.send_notification(token: 'jeton-appareil', title: 'Titre', body: 'Corps', url: nil, **args)
    end
    [result, url, request]
  end

  test "envoie le message au projet FCM avec le jeton OAuth" do
    result, url, request = deliver(Response.new(200, '{"name":"projects/add-test/messages/1"}'), badge: 3)

    assert_equal 'https://fcm.googleapis.com/v1/projects/add-test/messages:send', url
    assert_equal 'Bearer jeton-oauth', request.headers['Authorization']
    message = JSON.parse(request.body)['message']
    assert_equal 'jeton-appareil', message['token']
    assert_equal 'Titre', message['notification']['title']
    assert_equal 3, message['apns']['payload']['aps']['badge']
    assert_equal 'https://app.addfrance.fr', message['webpush']['fcm_options']['link']
    assert_equal 200, result[:status]
    assert_nil result[:error]
  end

  test "un jeton inconnu de FCM (404) est supprimé" do
    DeviceToken.create!(user: users(:simple), token: 'jeton-appareil', platform: 'mobile')

    result, = deliver(Response.new(404, '{"error":{"code":404,"status":"NOT_FOUND"}}'))
    assert_equal 404, result[:error]['code']
    assert_not DeviceToken.exists?(token: 'jeton-appareil')
  end

  test "une erreur réseau est renvoyée sans lever d'exception" do
    result, = deliver(Faraday::ConnectionFailed.new('injoignable'))
    assert_equal 'injoignable', result[:error]
    assert_nil result[:status]
  end

  test "une réponse illisible donne un corps vide" do
    result, = deliver(Response.new(500, '<html>'))
    assert_equal({}, result[:body])
  end
end
