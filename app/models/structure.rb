class Structure < ActiveRecord::Base

  has_many :is_memberships, :as => :is_memberable, :class_name => 'Membership'
  has_many :has_memberships, :as => :has_memberable, :class_name => 'Membership'

  validates :name, presence: true

  validate :has_president?

  def friendly_id
    sprintf '%05d', id
  end

  def has_president?
    if has_memberships.where(is_memberable_type: 'User', kind: :president).blank?
      errors.add(:is_memberships, :should_have_a_president)
    end
  end

  def full_address
    result = ""
    unless address_1.blank?
      result = address_1 + "<br>"
    end
    unless address_2.blank?
      result = result + address_2 + "<br>"
    end
    unless zipcode.blank?
      result = result + zipcode
    end
    unless town.blank?
      result = result + " " + town
    end
    result.html_safe
  end

  def self.global_search q
    where(['(name LIKE ? OR email LIKE ? OR id LIKE ?)', "#{q}%", "#{q}%", "#{q}%"])
  end


end
