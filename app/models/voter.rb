class Voter < ActiveRecord::Base
  belongs_to :motion
  belongs_to :elector
  belongs_to :resource, polymorphic: true

  validates :motion, :voted_at, :ip, presence: true

  validate :resource_xor_elector

  def resource_xor_elector
    if resource.blank? && elector.blank?
      errors.add(:voter, "Vote invalide")
    end
  end
end
