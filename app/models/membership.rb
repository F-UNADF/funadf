class Membership < ActiveRecord::Base
  belongs_to :role

  belongs_to :structure

  belongs_to :member, polymorphic: true

end
