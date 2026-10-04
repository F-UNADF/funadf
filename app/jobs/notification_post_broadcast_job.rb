class NotificationPostBroadcastJob < ApplicationJob
  queue_as :default

  JOB_NAME = "notification_post_broadcast".freeze

  def perform
    # On recupere les posts published_at aujourd'hui
    last_run = JobRun.find_by(job_name: JOB_NAME)&.ran_at || 4.hours.ago
    now = Time.current
    posts = Post.where(published_at: last_run..now)

    posts.each do |post|
      puts post.inspect
      structure = Structure.find post.structure_id

      # On part du principe que POUR L'INSTANT, on a pas besoin de commuiquer aux présidents des structures membres
      users = structure.users

      users = users
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

    JobRun.find_or_initialize_by(job_name: JOB_NAME)
          .update!(ran_at: now)
  end
end
