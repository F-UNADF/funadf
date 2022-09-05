class User < ActiveRecord::Base
  require 'digest/md5'
  include PublicActivity::Model
  acts_as_token_authenticatable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :invitable, :validate_on_invite => true

  # has_many :rolizations, as: :resource, dependent: :destroy
  # has_many :roles, through: :rolizations
  # has_many :associations, through: :roles, source: :resource, source_type: 'Association'
  # has_many :churches, through: :roles, source: :resource, source_type: 'Church'

  has_many :memberships, as: :member
  has_many :associations, through: :memberships, source: :structure
  has_many :churches, through: :memberships, source: :structure
  has_many :roles, through: :memberships

  has_one_attached :avatar

  has_many :careers, ->(career){order(start_at: :asc)}, class_name: "Career", foreign_key: :user_id

  has_many :interns, class_name: "Career", foreign_key: :referent_id
  has_many :gratitudes, ->(career){where('level IS NOT NULL')}, class_name: "Career", foreign_key: :user_id
  has_many :phases, ->(career){where('church_id IS NOT NULL')}, class_name: "Career", foreign_key: :user_id
  has_many :responsabilities, ->(career){where('association_id IS NOT NULL')}, class_name: "Career", foreign_key: :user_id

  accepts_nested_attributes_for :careers, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :gratitudes, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :phases, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :responsabilities, reject_if: :all_blank, allow_destroy: true

  validates :firstname, :lastname, presence: true

  scope :enabled, -> { where(disabled: false) }
  scope :disabled, -> { where(disabled: true) }

  has_one :wife_marriage, class_name: 'Marriage', foreign_key: :wife_id
  has_one :husband, class_name: 'User', through: :wife_marriage
  accepts_nested_attributes_for :wife_marriage, reject_if: :all_blank, allow_destroy: true

  has_one :husband_marriage, class_name: 'Marriage', foreign_key: :husband_id
  has_one :wife, class_name: 'User', through: :husband_marriage
  accepts_nested_attributes_for :husband_marriage, reject_if: :all_blank, allow_destroy: true

  before_update :track_update_activities
  after_create :track_create_activities

  def track_update_activities
    c = self.changes.reject! { |k| k.match(/created_at|updated_at|reset_password_token/)}
    self.create_activity key: 'user.update', owner: Proc.new{ |controller, model| (controller)? controller.current_user : nil }, parameters: c
  end

  def track_create_activities
    self.create_activity key: 'user.create', owner: Proc.new{ |controller, model| (controller)? controller.current_user : nil }
  end

  def application_roles
    roles.where(resource_id: nil, resource_type: nil)
  end

  def fullname
    "#{firstname} #{lastname}"
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

  def inline_address
    result = ""
    unless address_1.blank?
      result = address_1 + " "
    end
    unless address_2.blank?
      result = result + address_2 + " "
    end
    unless zipcode.blank?
      result = result + ' - ' + zipcode
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

  def has_role?(role_name, structure = nil)
    role = Role.find_by(name: role_name)
    !self.memberships.where(role: role, structure: structure).blank?
  end


  def add_role role_name, structure = nil, can_vote=true, reason=nil
    # Crée un rôle seul (Valable sur l'ensemble de l'APP)
    # OU Avec une Class (Valable uniquement sur cette Class)
    # OU Avec une resource (Valable que pour cette resource)

    role = Role.find_or_create_by(name: role_name)
    Membership.find_or_create_by(role: role, member: self, structure: structure, can_vote: can_vote, reason: reason)

    role
  end
  def remove_role role_name, structure = nil
    role = Role.find_or_create_by(name: role_name)
    membership = self.memberships.where(role: role, structure: structure).first

    membership.destroy

    role
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

  def church_presidences
    role = Role.where(name: :president).first
    Structure.where(id: self.memberships.where(role_id: role.id,  resource_type: 'Church').pluck(:resource_id))
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

  def can_switch?
    has_role? [:admin, :moderator]
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
    ['Probatoire', 'Pasteur stagiaire', 'Pasteur AEM', 'Pasteur APE', 'Ancien', 'Pasteur Agréé', 'Pasteur Partenaire', 'Autre', 'Femme de pasteur', 'Hors ADD', 'Invité']
  end
  def self.get_functions
    ['Président', 'Vice président', 'Pasteur adjoint', 'Pasteur stagiaire', 'Pasteur probatoire', 'Prédicateur', 'Missionnaire']
  end
  def self.get_responsabilities
    ['Président',
      'Vice président',
      'Secrétaire',
      'Secrétaire adjoint',
      'Trésorier',
      'Trésorier adjoint',
      'Chargé de mission',
      'Directeur',
      'Directeur adjoint',
      'Membre du CA',
      'Délégué',
      'Salarié',
      'Rédacteur en chef',
      'Enseignant']
  end

  def level
    g = gratitudes.order(start_at: :desc).first

    if g
      g.level
    else
      'Non renseigné'
    end
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

  def send_invitation_email
    UserMailer.send_direct_access(self).deliver
  end

  def gravatar_url
    hash = Digest::MD5.hexdigest(self.email)

    return "https://www.gravatar.com/avatar/#{hash}"
  end

  def wife_fullname
    f = nil
    if wife
      f = wife.fullname
    end
    f
  end
  def husband_fullname
    f = nil
    if husband
      f = husband.fullname
    end
    f
  end

  def get_avatar_url size=[150,150]
    width = size.first
    height = size.last
    if self.avatar.attached?
      self.avatar.representation(resize_and_pad: [width, height, gravity: 'north', background: '#f5f5f5'])
    else
      gravatar_url
    end
  end

  def self.allowed_params params
    if params[:user][:password].blank?
      params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                        :address_2, :zipcode, :town, :phone_1, :phone_2,
                        :email, :level, :birthdate, :avatar, :biography,
                        husband_marriage_attributes: [:husband_id, :wife_id],
                        wife_marriage_attributes: [:husband_id, :wife_id],
                        gratitudes_attributes: [:id, :level, :referent_id, :start_at, :_destroy],
                        phases_attributes: [:id, :church_id, :function, :start_at, :end_at, :_destroy],
                        responsabilities_attributes: [:id, :association_id, :function, :start_at, :end_at, :_destroy])
    else
      params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                        :address_2, :zipcode, :town, :phone_1, :phone_2, :biography,
                        :email, :level, :birthdate, :password, :password_confirmation, :avatar,
                        husband_marriage_attributes: [:husband_id, :wife_id],
                        wife_marriage_attributes: [:husband_id, :wife_id],
                        gratitudes_attributes: [:id, :level, :referent_id, :start_at, :_destroy],
                        phases_attributes: [:id, :church_id, :function, :start_at, :end_at, :_destroy],
                        responsabilities_attributes: [:id, :association_id, :function, :start_at, :end_at, :_destroy])
    end
  end


 end
