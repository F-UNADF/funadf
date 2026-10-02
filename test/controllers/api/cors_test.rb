require "test_helper"

# L'app mobile (WebView, origine capacitor://localhost ou http://localhost) appelle l'API
# en cross-origin : chaque méthode utilisée doit passer le pré-vol CORS.
class CorsTest < ActionDispatch::IntegrationTest
  test "le pré-vol autorise DELETE (désinscription du jeton FCM à la déconnexion, app 1.6.1)" do
    process :options, '/api/device_tokens/current', headers: {
      'Origin' => 'capacitor://localhost',
      'Access-Control-Request-Method' => 'DELETE',
      'Access-Control-Request-Headers' => 'authorization'
    }

    assert_includes @response.headers['Access-Control-Allow-Methods'].to_s.upcase, 'DELETE'
  end
end
