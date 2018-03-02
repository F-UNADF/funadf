class Role < ActiveRecord::Base

  belongs_to :resource, polymorphic: true

  has_many :rolizations, dependent: :destroy

  has_many :resources, through: :rolizations

  validates :name, uniqueness: { scope: [:resource_id, :resource_type], message: :already_exists }

end
