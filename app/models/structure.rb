class Structure < ActiveRecord::Base

  has_many :campaigns, dependent: :destroy
  has_many :electors, dependent: :destroy

  validates :name, :type, presence: true

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

  def self_electors
    Elector.where(resource_id: self.id, resource_type: self.get_class)
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

  def get_role(resource)
    roles = Role.where('id IN (?)', rolizations.where(resource_id: resource.id, resource_type: resource.get_class).pluck(:role_id))
    roles.pluck(:name).first
  end
  def get_resource_role(resource)
    roles = Role.where('id IN (?)', rolizations.where(resource_id: resource.id, resource_type: resource.get_class).pluck(:role_id))
    results = roles.pluck(:name).map{ |r| I18n.t 'activerecord.attributes.roles.names.'+r}.join(', ')
    if results.blank?
      "<em>Pas membre</em>".html_safe
    else
      results
    end
  end

  def add_role role_name, resource = nil
    # Crée un rôle seul (Valable sur l'ensemble de l'APP)
    # OU Avec une Class (Valable uniquement sur cette Class)
    # OU Avec une resource (Valable que pour cette resource)
    role = Role.find_or_create_by(name: role_name.to_s,
      resource_type: (resource.is_a?(Class) ? resource.to_s : resource.class if resource),
      resource_id: (resource.id if resource && !resource.is_a?(Class)))

    Rolization.find_or_create_by(role: role, resource: self)

    Elector.find_or_create_by(resource_id: self.id, resource_type: self.class, structure_id: resource) if resource && !resource.is_a?(Class)

    role
  end
  def remove_role role_name, resource = nil
    cond = { :name => role_name }
    cond[:resource_type] = (resource.is_a?(Class) ? resource.to_s : resource.class.name) if resource
    cond[:resource_id] = resource.id if resource && !resource.is_a?(Class)

    role = Role.find_by(name: role_name.to_s,
      resource_type: (resource.is_a?(Class) ? resource.to_s : resource.class.name if resource),
      resource_id: (resource.id if resource && !resource.is_a?(Class)))

    rolization = role.rolizations.where(resource: self).first
    rolization.destroy if rolization

    if role.rolizations.blank?
      role.destroy
    end

    Elector.find_by(resource: self, structure_id: resource.id).destroy if resource && !resource.is_a?(Class)
  end

  def get_class
    Structure.to_s
  end

  def is_elector?(resource)
    elector = self_electors.find_by(structure: resource)
    elector && elector.can_vote
  end

  def get_elector(resource)
    elector = self_electors.find_by(structure: resource)
    elector
  end

  def member_can_vote?(resource)
    electors.find_by(resource: resource).can_vote
  end
  def member_cant_vote_note(resource)
    electors.find_by(resource: resource).note
  end

  def self.get_structure_with_president user
    role_presidents = Role.joins(:rolizations).where(roles:{name: :president}, rolizations:{resource_id: user.id, resource_type: user.get_class})
    self.where(id: role_presidents.pluck(:resource_id))
  end

end
