class Notification < ActiveRecord::Base
  belongs_to :recipient, polymorphic: true
  belongs_to :sender, polymorphic: true
  belongs_to :notifiable, polymorphic: true

  def title
    case notifiable_type
    when 'Post'
      "Nouvelle actu : #{notifiable.title}"
    when 'Event'
      "Nouvel événement : #{notifiable.name}"
    else
      "Notification"
    end
  end
end
