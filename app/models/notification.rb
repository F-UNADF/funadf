class Notification < ActiveRecord::Base
  belongs_to :recipient, polymorphic: true
  belongs_to :sender, polymorphic: true
  belongs_to :notifiable, polymorphic: true

  def title
    case notifiable_type
    when 'Post'
      "Nouvelle actu : #{notifiable.title}"
    when 'Event'
      "Nouvel événement : #{notifiable.title}"
    else
      "Notification"
    end
  end

  def url
    case notifiable_type
    when 'Post'
      Rails.application.routes.url_helpers.me_post_url(notifiable)
    when 'Event'
      Rails.application.routes.url_helpers.me_event_url(notifiable)
    else
      Rails.application.routes.url_helpers.root_url
    end
  end
end
