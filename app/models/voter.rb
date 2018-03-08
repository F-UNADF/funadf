class Voter < ActiveRecord::Base
  belongs_to :motion
  belongs_to :elector

  validates :motion, :elector, :voted_at, :ip, presence: true
end
