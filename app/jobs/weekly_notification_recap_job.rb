class WeeklyNotificationRecapJob < ApplicationJob
  queue_as :default

  BATCH_SIZE = 500

  def perform
    range = previous_week_range

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
    tz = Time.zone
    start = tz.now.beginning_of_week - 1.week
    finish = start.end_of_week
    start..finish
  end

  def send_weekly_recap_to(user, range)
    scope = Notification.where(recipient: user, created_at: range)

    total = scope.count
    return if total.zero?

    notification_ids = scope.pluck(:id)

    UserMailer.notification_digest(user, notification_ids).deliver_later
  end

end