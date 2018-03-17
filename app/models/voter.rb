class Voter < ActiveRecord::Base
  belongs_to :motion
  belongs_to :elector
  belongs_to :user

  validates :motion, :voted_at, :ip, presence: true

  validate :user_xor_elector

  def user_xor_elector
    if user.blank? && elector.blank?
      errors.add(:voter, "Vote invalide")
    end
  end
end
