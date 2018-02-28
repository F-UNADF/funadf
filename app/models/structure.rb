class Structure < ActiveRecord::Base
  validates :name, presence: true

  def friendly_id
    sprintf '%05d', id
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

  def self.types
    {'Eglise' => 'Church', 'Association' => 'Association'}
  end

  def get_icon
    case type
    when "Church"
      'fire'
    when "Association"
      'building'
    end
  end

  def presidents
    User.with_role(:president, self).map {|user| user.fullname }.join(', ')
  end

  def members
    users + structures
  end

  def get_user_role(user_id)

  end


end
