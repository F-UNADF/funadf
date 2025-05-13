class PushNotification < ActiveRecord::Base

  has_many :accesses, as: :resource

  validates :title, :body, presence: true

end
