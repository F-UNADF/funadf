# app/services/fcm_http_service.rb
require 'googleauth'
require 'faraday'
require 'json'

class FcmNotificationService
  SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'

  def initialize
    @credentials = Google::Auth::ServiceAccountCredentials.make_creds(
      json_key_io: File.open(Rails.root.join('config', 'credential.json')),
      scope: SCOPE
    )
    @project_id = JSON.parse(File.read(Rails.root.join('config', 'credential.json')))['project_id']
  end

  def send_notification(token:, title:, body:)
    access_token = @credentials.fetch_access_token!['access_token']

    payload = {
      message: {
        token: token,
        notification: {
          title: title,
          body: body
        }
      }
    }

    response = Faraday.post("https://fcm.googleapis.com/v1/projects/#{@project_id}/messages:send") do |req|
      req.headers['Authorization'] = "Bearer #{access_token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = payload.to_json
    end

    {
      status: response.status,
      body: JSON.parse(response.body)
    }
  rescue Faraday::Error => e
    Rails.logger.error("[FCM] HTTP error: #{e.message}")
    { error: e.message }
  rescue => e
    Rails.logger.error("[FCM] General error: #{e.message}")
    { error: e.message }
  end
end
