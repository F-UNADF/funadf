class Marriage < ActiveRecord::Base

  belongs_to :husband, class_name: "User", foreign_key: :husband_id
  belongs_to :wife, class_name: "User", foreign_key: :wife_id

end
