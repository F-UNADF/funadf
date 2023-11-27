class Role < ActiveRecord::Base
  has_many :memberships
  validates :name, presence: true, uniqueness: true

  def is_app_role?
    # On check si le rôle est au niveau applicatif
    memberships.where(structure_id: nil).blank?
  end
end
