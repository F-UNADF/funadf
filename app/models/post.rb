class Post < ActiveRecord::Base

  has_many :accesses, as: :resource
  accepts_nested_attributes_for :accesses, reject_if: :all_blank, allow_destroy: true

  belongs_to :structure

  has_many_attached :files

  delegate :name, to: :structure, prefix: true
  after_commit :notify_async, on: [:create]

  def images
    files.select do |file|
      file.content_type.start_with?('image/')
    end
  end

  def attachments
    files.reject do |file|
      file.content_type.start_with?('image/')
    end
  end

  def notify_async
    Rails.logger.info "[DEBUG] after_create_commit déclenché pour Post##{self.id}"
    NotificationPostBroadcastJob.perform_later(self.id)
  end

end
