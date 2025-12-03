class NotificationPostBroadcastJob < ApplicationJob
  queue_as :default


  def perform
    # On recupere les posts published_at aujourd'hui
    posts = Post.where(published_at: Time.current.beginning_of_day..Time.current.end_of_day)

    posts.each do |post|
      structure = post.structure
      users = User
        .with_current_level_in(post.accesses.pluck(:level).uniq)


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
end
