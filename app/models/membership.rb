class Membership < ApplicationRecord
  belongs_to :role
  belongs_to :structure
  belongs_to :user
end
