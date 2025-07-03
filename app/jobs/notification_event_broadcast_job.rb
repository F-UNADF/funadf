class NotificationEventBroadcastJob < ApplicationJob
  queue_as :default

  def perform(event_id)
    event = Event.find(event_id)

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
end
