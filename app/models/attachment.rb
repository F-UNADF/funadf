class Attachment < ActiveRecord::Base
  belongs_to :post

  has_one_attached :file
end
