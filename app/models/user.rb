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

  def application_roles
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
    resource_id = resource.id if resource
    resource_type = resource.class if resource
    unless new_record?
      role_array = roles.where(name: role_name, resource_id: resource_id, resource_type: resource_type)
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

  def get_presidences
    presidences = []
    structures.each do |s|
      presidences << s if self.has_role? :president, s
    end
    presidences
  end

  def get_class
    User.to_s
  end

  def is_elector?(structure)
    elector = electors.find_by(structure: structure)
    elector && elector.can_vote
  end

  def has_voted?(campaign)
    structure = Structure.find(campaign.structure_id)
    elector = electors.find_by(structure: structure)
    if elector
      campaign.has_already_vote?(elector)
    else
      campaign.has_already_vote?(user)
    end
  end

  def self.prepare_import(upload)
    keys = []

    CSV.foreach(File.open(upload.file.current_path), headers: false) do |row|
      if upload.has_heading
        row.each do |k|
          keys<<k
        end
      else
        row.each_with_index do |k, index|
          keys<<"col-#{index}"
        end
      end
      break
    end
    keys
  end

  def self.get_import_fields
    [
      ['ID', :id],
      ['NOM', :firstname],
      ['PRENOM', :lastname],
      ['EMAIL', :email],
      ['PORTABLE', :phone_1],
      ['FIXE', :phone_2],
      ['ADRESSE', :address_1],
      ['CODE POSTAL', :zipcode],
      ['VILLE', :town],
      ['DATE DE NAISSANCE', :birthday],
      ['RECONNAISSANCE', :level]
    ]
  end

  def self.get_levels
    %w(Probatoire Stagiaire AEM APE Ancien Agréé Partenaire Autre)
  end
  def can_vote
    true
  end

  def self.accept_invitation!(attributes={})
    invitable = find_by(invitation_token: attributes[:invitation_token])
    if invitable.errors.empty?
      invitable.assign_attributes(attributes)
      invitable.accept_invitation!
    end
    invitable
  end
 end
