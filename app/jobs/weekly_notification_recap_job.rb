class WeeklyNotificationRecapJob < ApplicationJob
  queue_as :default

  BATCH_SIZE = 500

  def perform
    range = previous_week_range

    # On ne veut pas charger toutes les notifs.
    # On parcourt les users qui ont eu des notifs dans la période.
    user_ids = Notification
      .where(created_at: range)
      .distinct
      .pluck(:recipient_id)

    user_ids.each_slice(BATCH_SIZE) do |batch|
      User.where(id: batch).find_each do |user|
        send_weekly_recap_to(user, range)
      end
    end
  end

  private

  def previous_week_range
    # Semaine précédente (lundi -> dimanche) en timezone app
    tz = Time.zone
    start = tz.now.beginning_of_week - 1.week
    finish = start.end_of_week
    start..finish
  end

  def send_weekly_recap_to(user, range)
    # Exemple: compter et/ou regrouper par type
    scope = Notification.where(recipient: user, created_at: range)

    total = scope.count
    return if total.zero?

    UserMailer.notification_digest(user, scope).deliver_later
  end
end
