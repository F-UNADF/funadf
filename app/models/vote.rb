class Vote < ActiveRecord::Base
  belongs_to :motion

  validates :motion, presence: true

  scope :officials, -> { where(is_consultative: false) }
  scope :consultatives, -> { where(is_consultative: true) }
end
