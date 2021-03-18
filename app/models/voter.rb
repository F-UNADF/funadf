class Voter < ActiveRecord::Base
  self.primary_key = 'resource_id'
  belongs_to :motion
  belongs_to :resource, polymorphic: true

  validates :motion, :voted_at, :ip, presence: true

  validates :resource, presence: true

end
