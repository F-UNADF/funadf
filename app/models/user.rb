class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :invitable, :validate_on_invite => true

  has_attached_file :avatar, default_url: "default_avatar.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  has_many :rolizations, as: :resource, dependent: :destroy
  has_many :roles, through: :rolizations
  has_many :associations, through: :roles, source: :resource, source_type: 'Association'
  has_many :churches, through: :roles, source: :resource, source_type: 'Church'

  validates :firstname, :lastname, presence: true

  scope :enabled, -> { where(disabled: false) }
  scope :disabled, -> { where(disabled: true) }

  def application_roles
    roles.where(resource_id: nil, resource_type: nil)
  end

  def fullname
    lastname + " " + firstname
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

    roles
  end
  def has_any_role? structure
    structures.include?(structure)
  end

  def structures
    Structure.where(id: (associations + churches))
  end

  def get_presidences
    presidences = []
    structures.each do |s|
      presidences << s if self.has_role? :president, s
    end
    presidences
  end

  def get_prez
    self.roles.where(name: 'president')
  end

  def church_presidences
    Structure.where(id: self.roles.where(resource_type: 'Church').pluck(:resource_id))
  end

  def get_class
    User.to_s
  end

  def is_elector?(structure)
    elector = electors.find_by(structure: structure)
    elector && elector.can_vote
  end

  def is_admin?
    has_role? :admin
  end

  def has_voted?(campaign)
    structure = Structure.find(campaign.structure_id)

    campaign.has_already_vote?(self)
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
    ['Probatoire', 'Pasteur stagiaire', 'Pasteur AEM', 'Pasteur APE', 'Ancien', 'Pasteur Agréé', 'Pasteur Partenaire', 'Autre', 'Femme de pasteur', 'Hors ADD']
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

  def my_roles
    roles
  end

  def campaigns
    #ON CHERCH LES CAMPAGNES :
    # - ASSOC DONT JE SUIS MEMBRE ET OU JE PEUX VOTER
    # - ASSOC DONT JE NE SUIS PAS MEMBRE ET OU JE PEUX VOTER

    # JE PEUX VOTER : MEMBERSHIP CAN_VOTE OU TABLE DES VOTES
    Campaign.where(structure_id: (associations + churches)).with_states([:coming, :opened]).order(name: :asc)

  end

 end
