class Post < ActiveRecord::Base
  belongs_to :structure
  has_many_attached :files

  delegate :name, to: :structure, prefix: true

end
