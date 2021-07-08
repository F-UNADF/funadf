class Intranet < ActiveRecord::Base
  belongs_to :structure
  delegate :name, to: :structure, prefix: true

end
