class Membership < ActiveRecord::Base
  belongs_to :role
  belongs_to :structure
  belongs_to :member, polymorphic: true

  delegate :name, to: :role, prefix: true, allow_nil: true
end
