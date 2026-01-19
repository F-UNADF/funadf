class NotificationDigestJob < ApplicationJob
  queue_as :default

  def perform
    # Sélectionne les notifs non encore envoyées
    grouped = Notification
                .where(read: false, notified_at: nil)
                .group_by(&:recipient)

    puts "Envoi des notifications groupées pour #{grouped.count} utilisateurs."

    grouped.each do |user, notifs|
      next if notifs.empty?

      # (Optionnel) Envoi Push ici
      service = FcmNotificationService.new
      
      title = "Nouvelles notifications sur ADD+ !"
      body = "Il y a du nouveau sur ADD+ ! Vous avez #{notifs.count} notifications non lues !"
      device_tokens = user.device_tokens.pluck(:token).uniq
      puts "Envoi de la notification push à #{device_tokens.count} appareils."
      device_tokens.each do |token|
        response = service.send_notification(
          token: token,
          title: title,
          body: body,
          url: 'https://app.addfrance.fr',
          badge: notifs.count
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