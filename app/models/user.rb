class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :invitable, :validate_on_invite => true

  has_attached_file :avatar, :styles => { medium: "300x300#", thumb: "100x100#" }, default_url: "default_avatar.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/


  has_many :rolizations, as: :resource
  has_many :roles, through: :rolizations
  has_many :associations, through: :roles, source: :resource, source_type: 'Association'
  has_many :churches, through: :roles, source: :resource, source_type: 'Church'

  # ELECTEURS DIRECT
  has_many :electors, as: :resource

  validates :firstname, :lastname, presence: true

  def applicatin_roles
    roles.where(resource_id: nil, resource_type: nil)
  end

  def fullname
    firstname + " " + lastname
  end
  alias name fullname

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

  def friendly_id
    sprintf '%05d', id
  end

  def self.global_search q
    where(['(firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR id LIKE ?)', "#{q}%", "#{q}%", "#{q}%", "#{q}%"])
  end


  def has_role?(role_name, resource = nil)
    return has_strict_role?(role_name, resource) if self.class.strict_rolify and resource and resource != :any

    unless new_record?
      role_array = roles.where(name: role_name, resource: resource)
    end

    return false if role_array.nil?
    role_array != []
  end

  def has_strict_role?(role_name, resource)
    roles.where_strict(name: role_name, resource: resource).any?
  end

  def add_role role_name, resource = nil
    # Crée un rôle seul (Valable sur l'ensemble de l'APP)
    # OU Avec une Class (Valable uniquement sur cette Class)
    # OU Avec une resource (Valable que pour cette resource)

    role = Role.find_or_create_by(name: role_name.to_s,
      resource_type: (resource.is_a?(Class) ? resource.to_s : resource.class.name if resource),
      resource_id: (resource.id if resource && !resource.is_a?(Class)))

    if !roles.include?(role)
      self.roles << role
      self.save
    end

    Elector.find_or_create_by(resource: self, structure_id: resource.id) if resource && !resource.is_a?(Class)

    role
  end
  def remove_role role_name, resource = nil
    cond = { :name => role_name }
    cond[:resource_type] = (resource.is_a?(Class) ? resource.to_s : resource.class.name) if resource
    cond[:resource_id] = resource.id if resource && !resource.is_a?(Class)
    roles = self.roles.where(cond)
    if roles
      self.roles.delete(roles)
      roles.each do |role|
        role.destroy if role.rolizations.blank?
      end
    end

    Elector.find_by(resource: self, structure_id: resource.id).destroy if resource && !resource.is_a?(Class)

    roles
  end
  def has_any_role? structure
    structures.include?(structure)
  end

  def structures
    (associations + churches).sort_by{|s| s.name}
  end

  def get_class
    User.to_s
  end
 end
