
namespace :events do
  desc "Envoie des notifications s'il y a de nouveaux événements ou des événements à venir dans un mois"
  task send_notif: :environment do
    include Rails.application.routes.url_helpers
    Rails.application.routes.default_url_options[:host] = 'https://app.addfrance.fr'

    # 1. Nouveaux événements créés dans les 7 derniers jours
    recent_events = Event.where('created_at >= ?', 7.days.ago)

    # 2. Événements dont la date de début est dans exactement 1 mois (approximativement à 1 jour près)
    target_date = Date.today + 1.month
    start_range = (target_date - 3.days).beginning_of_day
    end_range = (target_date + 3.days).end_of_day
    upcoming_events = Event.where(start_at: start_range..end_range)

    if recent_events.exists?
      puts "📣 #{recent_events.count} nouveaux événements cette semaine"

      # 1. Récupère tous les levels autorisés
      levels_required = recent_events.flat_map { |event| event.accesses.pluck(:level) }.uniq
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
      
      title = "Nouveaux événements sur ADD+ !"
      body = "Il y a de nouveaux événements disponibles cette semaine. Consultez-les dès maintenant !"

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
      puts "Aucun nouvel événement cette semaine"
    end

    if upcoming_events.exists?
      puts "⏳ #{upcoming_events.count} événements prévus dans un mois"

      # 1. Récupère tous les levels autorisés
      levels_required = upcoming_events.flat_map { |event| event.accesses.pluck(:level) }.uniq
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
      
      title = "J-30 avant #{upcoming_events.pluck(:title).join(', ')} !"
      body = "Préparez-vous pour les événements à venir dans un mois. Ne manquez pas ces occasions !"

      device_tokens.each do |token|
        puts "🔔 Envoi de notification à #{token}"
        response = service.send_notification(
          token: token,
          title: title,
          body: body,
          url: me_feed_url
        )

        puts response
        if response[:error]
          puts "Erreur lors de l'envoi de la notification : #{response[:error]}"
        else
          puts "Notification envoyée avec succès à #{token}"
        end
      end

    else
      puts "Aucun événement prévu dans un mois"
    end
  end
end
