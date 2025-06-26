class Notification < ActiveRecord::Base
  belongs_to :recipient, polymorphic: true
  belongs_to :sender, polymorphic: true
  belongs_to :notifiable, polymorphic: true
end
