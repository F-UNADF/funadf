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

  def send_notification(token:, title:, body:, url:)
    access_token = @credentials.fetch_access_token!['access_token']

    if url.nil?
      url = 'https://app.addfrance.fr'
    end

    payload = {
      message: {
        token: token,
        notification: {
          title: title,
          body: body,
          image: 'https://app.addfrance.fr/logo_plus.png'
        },
        android: {
          notification: {
            icon: 'ic_launcher',
            color: '#1E88E5',
            sound: 'default'
          },
          priority: 'high'
        },
        apns: {
          headers: {
            'apns-priority': '10'
          },
          payload: {
            aps: {
              alert: {
                title: title,
                body: body
              },
              sound: 'default',
              badge: 1
            }
          }
        },
        webpush: {
          notification: {
            title: title,
            body: body,
            icon: 'https://app.addfrance.fr/logo_plus.png',
            click_action: url
          },
          fcm_options: {
            link: url
          }
        }
      }
    }


    puts payload.inspect

    response = Faraday.post("https://fcm.googleapis.com/v1/projects/#{@project_id}/messages:send") do |req|
      req.headers['Authorization'] = "Bearer #{access_token}"
      req.headers['Content-Type'] = 'application/json'
      req.body = payload.to_json
    end

    # Si response code === 404, on suprime le token
    if response.status == 404
      DeviceToken.where(token: token).destroy_all
      Rails.logger.error("[FCM] Token not found: #{token}")
    end

    return {
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
