class Fee < ActiveRecord::Base
  belongs_to :member, polymorphic: true

  validates :what, :paid_at, presence: true
end
