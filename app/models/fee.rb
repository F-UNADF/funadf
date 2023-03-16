class Fee < ActiveRecord::Base
  belongs_to :user

  validates :what, :paid_at, presence: true
end
