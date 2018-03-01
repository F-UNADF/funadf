class Rolization < ActiveRecord::Base

  belongs_to :role
  belongs_to :resource, polymorphic: true

  validates :role_id, presence: true


end