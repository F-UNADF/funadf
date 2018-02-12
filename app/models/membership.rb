class Membership < ActiveRecord::Base
  belongs_to :is_memberable, polymorphic: true
  belongs_to :has_memberable, polymorphic: true

  validates :is_memberable, :has_memberable, presence: true
  validates :kind, inclusion: { in: [:president, :treasurer, :secretary, :member], message: 'valeur incorrecte'}, allow_blank: nil

  delegate :name, :phone_1, :email, :friendly_id, to: :is_memberable, prefix: :member
end
