class Role < ActiveRecord::Base
  belongs_to :resource, polymorphic: true #a supprimer
  has_many :memberships

  validates :name, presence: true, uniqueness: true
end
