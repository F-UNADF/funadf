class Event < ActiveRecord::Base

  belongs_to :structure
  belongs_to :category

  has_many :accesses, as: :resource
  accepts_nested_attributes_for :accesses, reject_if: :all_blank, allow_destroy: true

  has_many_attached :files

  delegate :name, to: :category, prefix: true
  delegate :name, to: :structure, prefix: true

  validates :category_id, :start_at, :end_at, :title, presence: true

  after_commit :notify_async, on: :create

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
    NotificationEventBroadcastJob.perform_later(self.id)
  end

end
