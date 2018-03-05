class Campaign < ActiveRecord::Base

  belongs_to :structure
  has_many :motions
  accepts_nested_attributes_for :motions, reject_if: :all_blank, allow_destroy: true

  validates :name, presence: true
end
