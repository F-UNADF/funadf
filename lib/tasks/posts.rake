
namespace :posts do
  desc "Envoie des notifications s'il y a de nouveaux posts "
  task send_notif: :environment do
    include Rails.application.routes.url_helpers
    Rails.application.routes.default_url_options[:host] = 'https://app.addfrance.fr'

    # Nouvelle actu dans les 6 dernieres heures
    recents_posts = Post.where('created_at >= ?', 6.hours.ago)

    if recents_posts.exists?
      puts "📣 #{recents_posts.count} nouvelles actus cette semaine"

      # 1. Récupère tous les levels autorisés
      levels_required = recents_posts.flat_map { |post| post.accesses.pluck(:level) }.uniq
      puts "🔐 Niveaux d'accès requis : #{levels_required.join(', ')}"

      # 2. Récupère les utilisateurs ayant un level correspondant
      matching_users = User.all.select do |user|
        levels_required.include?(user.level)
      end

      if matching_users.empty?
        puts "🚫 Aucun utilisateur avec les niveaux requis"
        next
      end

      # 3. Récupère tous les tokens
      device_tokens = matching_users.flat_map { |user| user.device_tokens.pluck(:token) }.uniq

      if device_tokens.empty?
        puts "📵 Aucun token disponible pour les utilisateurs ciblés"
        next
      end

      service = FcmNotificationService.new
      
      title = "Nouvelles actualités sur ADD+ !"
      body = "Il y a de nouvelles actualités sur ADD+. Consultez-les dès maintenant !"

      device_tokens.each do |token|
        puts "🔔 Envoi de notification à #{token}"
        response = service.send_notification(
          token: token,
          title: title,
          body: body,
          url: me_feed_url
        )

        puts response
        if response[:body][:error]
          puts "Erreur lors de l'envoi de la notification : #{response[:error]}"
        else
          puts "Notification envoyée avec succès à #{token}"
        end
      end
    else
      puts "Aucun nouvelle actu depuis la derniere fois"
    end
  end
end
