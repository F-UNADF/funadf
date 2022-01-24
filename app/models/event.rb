class Event < ActiveRecord::Base

  belongs_to :structure
  belongs_to :category

  has_many :accesses, as: :resource
  accepts_nested_attributes_for :accesses, reject_if: :all_blank, allow_destroy: true

  has_many_attached :files

  delegate :name, to: :category, prefix: true
  delegate :name, to: :structure, prefix: true

  validates :category_id, :start_at, :end_at, :title, presence: true


end
