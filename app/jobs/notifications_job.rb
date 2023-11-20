class NotificationsJob < ActiveJob::Base
  queue_as :default

  def perform(notification)
    url = URI("https://onesignal.com/api/v1/notifications")

    https = Net::HTTP.new(url.host, url.port)
    https.use_ssl = true

    request = Net::HTTP::Post.new(url)
    request["Content-Type"] = "application/json; charset=utf-8"
    request["Authorization"] = "Basic N2NhZGE4YzYtOTBjMS00MzJhLWI0ZDMtNDlkZjkyYzIyYTlk"

    body = {
      app_id: 'b7fd3bdd-1cf5-473a-a8ca-9af528f123b8',
      contents: {
        en: notification.content,
      },
      headings: {
        en: notification.title
      },
      included_segments: ["Subscribed Users"]
    }.to_json

    request.body = body

    response = https.request(request)
  end
end
