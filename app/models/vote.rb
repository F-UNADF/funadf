class Vote < ActiveRecord::Base
  belongs_to :motion

  validates :motion, presence: true
end
