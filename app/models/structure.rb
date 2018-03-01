class Structure < ActiveRecord::Base

  validates :name, presence: true

  def roles
    Role.where(resource_id: self.id, resource_type: self.type)
  end
  def rolizations
    Rolization.where('role_id IN (?)', roles.pluck(:id))
  end
  def users
    User.where('id IN (?)', rolizations.where('resource_type = "User"').pluck(:resource_id))
  end
  def structures
    Structure.where('id IN (?)', rolizations.where('resource_type = "Structure"').pluck(:resource_id))
  end
  def members
    (users + structures)
  end

  def my_rolisations
    Rolization.where('resource_id = ? AND resource_type = ?', self.id, "Structure")
  end
  def my_roles
    Role.where("id IN (?)", my_rolisations.pluck(:role_id))
  end
  def memberships
    result = []
    my_roles.each do |r|
      result.push(r.resource)
    end
    result
  end

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

  def get_user_role(user_id)
    roles = Role.where('id IN (?)', rolizations.where(resource_id: user_id).pluck(:role_id))
    roles.pluck(:name).map{ |r| I18n.t 'activerecord.attributes.roles.names.'+r}.join(', ')
  end

  def add_role role_name, resource = nil
    # Crée un rôle seul (Valable sur l'ensemble de l'APP)
    # OU Avec une Class (Valable uniquement sur cette Class)
    # OU Avec une resource (Valable que pour cette resource)
    role = Role.find_or_create_by(name: role_name.to_s,
      resource_type: (resource.is_a?(Class) ? resource.to_s : resource.class.name if resource),
      resource_id: (resource.id if resource && !resource.is_a?(Class)))

    Rolization.find_or_create_by(role: role, resource: self)

    role
  end

end
