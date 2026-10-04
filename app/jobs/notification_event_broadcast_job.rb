class NotificationEventBroadcastJob < ApplicationJob
  queue_as :default
  
  JOB_NAME = "notification_event_broadcast".freeze

  def perform
    last_run = JobRun.find_by(job_name: JOB_NAME)&.ran_at || 4.hours.ago
    now = Time.current
    events = Event.where(created_at: last_run..now)

    events.each do |event|
      users = User.with_current_level_in(event.accesses.pluck(:level).uniq)
      users.each do |user|
        Notification.create!(
          recipient: user,
          sender: event.structure,
          notifiable: event,
          action: 'created',
          read: false
        )
      end
    end
    JobRun.find_or_initialize_by(job_name: JOB_NAME)
          .update!(ran_at: now)
  end
end
