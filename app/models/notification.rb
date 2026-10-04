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

  def structure
    notifiable.structure
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

  def excerpt(limit: 140)
    raw_text =
      case notifiable_type
      when 'Post'
        ActionView::Base.full_sanitizer.sanitize(notifiable.content.to_s)
      when 'Event'
        notifiable.description.to_s
      else
        ""
      end

    text = raw_text.squish

    text.truncate(limit, separator: ' ')
  end

  def image_url
    image = notifiable.images.first
    return nil unless image

    # si ActiveStorage
    Rails.application.routes.url_helpers.rails_representation_url(
      image.variant(resize_to_fill: [200, 200]),
      only_path: false
    )
  rescue
    nil
  end

end
