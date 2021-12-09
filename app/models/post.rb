class Post < ActiveRecord::Base
  belongs_to :structure

  has_many :attachments
end
