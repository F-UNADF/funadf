class PushNotification < ActiveRecord::Base
  validates :title, :body, presence: true
end
