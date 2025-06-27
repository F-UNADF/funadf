class NotificationDigestJob < ApplicationJob
  queue_as :default

  def perform
    # Sélectionne les notifs non encore envoyées
    grouped = Notification
                .where(read: false, notified_at: nil)
                .where("created_at < ?", 10.minutes.ago) # buffer anti-doublon
                .group_by(&:recipient)

    grouped.each do |user, notifs|
      next if notifs.empty?

      # Envoi par mail
      UserMailer.notification_digest(user, notifs).deliver_later

      # (Optionnel) Envoi Push ici
      service = FcmNotificationService.new
      
      title = "Nouvelles notifications sur ADD+ !"
      body = "Il y a du nouveau sur ADD+ ! Vous avez #{notifs.count} notifications non lues !"
      device_tokens = user.device_tokens.pluck(:token).uniq
      next if device_tokens.empty?
      device_tokens.each do |token|
        response = service.send_notification(
          token: token,
          title: title,
          body: body,
          url: me_feed_url
        )

        if response[:body][:error]
          puts "Erreur lors de l'envoi de la notification : #{response[:error]}"
        else
          puts "Notification envoyée avec succès à #{token}"
        end
      end

      # Marque les notifs comme "envoyées"
      Notification.where(id: notifs.map(&:id)).update_all(notified_at: Time.current)
    end
  end
end