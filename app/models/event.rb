class Event < ActiveRecord::Base

  belongs_to :structure
  belongs_to :category

  delegate :name, to: :category, prefix: true

end
