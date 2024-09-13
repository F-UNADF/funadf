class ApiToken < ActiveRecord::Base
  belongs_to :user

  validates :token, presence: true, uniqueness: true

  before_validation :generate_token, on: :create

  private
  def generate_token
    self.active = true
    self.token = SecureRandom.hex(32)
  end
end

