class Backup < ActiveRecord::Base
  has_one_attached :file
end
