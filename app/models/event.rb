class Event < ActiveRecord::Base

  belongs_to :structure
  belongs_to :category

  delegate :name, to: :category, prefix: true
  delegate :name, to: :structure, prefix: true

  validates :category_id, :start_at, :end_at, :title, presence: true

end
