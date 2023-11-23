class Role < ActiveRecord::Base
  has_many :memberships
  validates :name, presence: true, uniqueness: true
end
