class NotificationDigestJob < ApplicationJob
  queue_as :default

  def perform
    # Sélectionne les notifs non encore envoyées
    grouped = Notification
                .where(read: false, notified_at: nil)
                .group_by(&:recipient)

    Rails.logger.info("[Digest] Envoi des notifications groupées pour #{grouped.count} utilisateurs.")

    service = FcmNotificationService.new

    grouped.each do |user, notifs|
      next if notifs.empty?

      title = "Nouvelles notifications sur ADD+ !"
      body = "Il y a du nouveau sur ADD+ ! Vous avez #{notifs.count} notifications non lues !"
      device_tokens = user.device_tokens.pluck(:token).uniq
      Rails.logger.info("[Digest] Envoi de la notification push à #{device_tokens.count} appareils pour l'utilisateur #{user.id}.")

      device_tokens.each do |token|
        response = service.send_notification(
          token: token,
          title: title,
          body: body,
          url: 'https://app.addfrance.fr',
          badge: notifs.count
        )

        if response[:error]
          Rails.logger.error("[Digest] Erreur lors de l'envoi de la notification à #{token} : #{response[:error]}")
        else
          Rails.logger.info("[Digest] Notification envoyée avec succès à #{token}")
        end
      end

      # Marque les notifs comme "envoyées"
      Notification.where(id: notifs.map(&:id)).update_all(notified_at: Time.current)
    rescue => e
      # Un utilisateur en échec ne doit pas empêcher les suivants d'être notifiés
      Rails.logger.error("[Digest] Échec du digest pour l'utilisateur #{user&.id} : #{e.class} #{e.message}")
    end
  end
end
