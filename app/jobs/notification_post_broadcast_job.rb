class NotificationPostBroadcastJob < ApplicationJob
  queue_as :default


  def perform(post_id)
    post = Post.find(post_id)

    users = User.with_current_level_in(post.accesses.pluck(:level).uniq)

    users.each do |user|
      Notification.create!(
        recipient: user,
        sender: post.structure,
        notifiable: post,
        action: 'created',
        read: false
      )
    end
  end
end
