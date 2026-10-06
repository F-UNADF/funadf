class User < ActiveRecord::Base
  include PublicActivity::Model
  acts_as_token_authenticatable

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable,
         :validate_on_invite => true

  has_many :memberships, as: :member
  has_many :associations, through: :memberships, source: :structure
  has_many :churches, through: :memberships, source: :structure
  has_many :regions, through: :memberships, source: :structure
  has_many :roles, through: :memberships

  has_one_attached :avatar

  has_many :careers, class_name: "Career", foreign_key: :user_id

  has_many :interns, class_name: "Career", foreign_key: :referent_id
  has_many :gratitudes, ->(career) { where('level IS NOT NULL') }, class_name: "Career", foreign_key: :user_id
  has_many :phases, ->(career) { where('church_id IS NOT NULL') }, class_name: "Career", foreign_key: :user_id
  has_many :responsabilities, ->(career) { where('association_id IS NOT NULL') }, class_name: "Career", foreign_key: :user_id

  has_many :fees, as: :member, dependent: :destroy

  has_many :notifications, as: :recipient, dependent: :destroy
  has_many :api_tokens, dependent: :destroy
  has_many :sso_tokens, dependent: :destroy

  accepts_nested_attributes_for :careers, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :gratitudes, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :phases, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :responsabilities, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :fees, reject_if: :all_blank, allow_destroy: true

  validates :firstname, :lastname, presence: true

  scope :enabled, -> { where(disabled: 0) }
  scope :disabled, -> { where(disabled: 1) }

  # Un compte désactivé ne peut plus rien faire : ni se connecter (web, mobile,
  # Devise), ni utiliser un jeton d'API déjà émis, ni ouvrir une session Archivate.
  def active_for_authentication?
    super && !disabled?
  end

  scope :with_current_level_in, ->(levels) {
    joins(<<~SQL)
      INNER JOIN (
        SELECT c1.*
        FROM careers c1
        INNER JOIN (
          SELECT user_id, MAX(start_at) AS max_start_at
          FROM careers
          WHERE level IS NOT NULL
          GROUP BY user_id
        ) c2 ON c1.user_id = c2.user_id AND c1.start_at = c2.max_start_at
        WHERE c1.level IS NOT NULL
      ) AS recent_careers ON recent_careers.user_id = users.id
    SQL
    .where("recent_careers.level IN (?)", levels)
  }

  has_many :device_tokens, dependent: :destroy

  # Jetons et secrets jamais exposés dans une réponse JSON (en plus de la liste de Devise).
  SECRET_ATTRIBUTES = %w[encrypted_password reset_password_token invitation_token
                         access_token authentication_token fcm_token].freeze

  def serializable_hash(options = nil)
    options = (options || {}).dup
    options[:except] = Array(options[:except]).map(&:to_s) | SECRET_ATTRIBUTES
    super(options)
  end

  # Attributs bruts (y compris les colonnes calculées d'un `select`) sans les secrets.
  def public_attributes
    attributes.except(*SECRET_ATTRIBUTES)
  end

  before_validation :clean_name_attributes

  def clean_name_attributes
    self.lastname = lastname.to_s.strip.upcase
    self.firstname = firstname.to_s.strip.titlecase
  end

  def application_roles
    memberships.where(structure_id: nil).map(&:role).map(&:name)
  end

  def fullname
    "#{firstname} #{lastname}"
  end

  alias name fullname

  def has_role?(role_name, structure = nil)
    if structure.blank?
      return !self.roles.where(name: role_name).blank?
    end

    if self.memberships.joins(:role).where('roles.name IN (?)', role_name).pluck(:structure_id).include?(structure.id)
      return true
    end

    return false
  end

  def add_role role_name, structure = nil, can_vote = true, reason = nil
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

    # Rôle déjà absent : rien à retirer
    membership&.destroy

    role
  end

  def get_presidences
    role = Role.where(name: :president).first
    return Structure.none unless role

    Structure.select('*', 'type AS type').where(id: self.memberships.where(role_id: role.id).pluck(:structure_id))
  end

  def associations_responsabilities
    Structure.joins(memberships: :role)
             .where(type: 'Association')
             .where(roles: { name: %w[president secretary treasurer director] })
             .where(memberships: { member_type: 'User', member_id: self.id })
  end

  def regions_responsabilities
    Structure.joins(memberships: :role)
             .where(type: 'Region')
             .where(roles: { name: %w[president secretary treasurer director] })
             .where(memberships: { member_type: 'User', member_id: self.id })
  end

  def is_admin?
    has_role? :admin
  end

  def can_switch?
    has_role? [:admin, :moderator]
  end

  # Campagnes en cours où l'utilisateur a encore un bulletin à utiliser
  # (y compris bloqué, pour qu'il voie pourquoi il ne peut pas voter).
  def eligible_campaign_ids
    Campaign.currents.select { |campaign| campaign.ballots_for(self).any? { |ballot| ballot.has_voted.nil? } }.map(&:id)
  end

  def self.get_levels
    [
      'Probatoire',
      'Pasteur stagiaire',
      'Pasteur AEM',
      'Pasteur APE',
      'Ministère P1',
      'Ministère P2',
      'Pasteur Agréé AEM',
      'Pasteur Agréé APE',
      'Pasteur Partenaire',
      'Autre',
      'Femme de pasteur',
      'Hors ADD',
      'Invité',
      'Ancien'
    ]
  end

  def self.get_functions
    [
      'Président',
      'Vice président',
      'Pasteur principal',
      'Pasteur associé',
      'Pasteur en formation',
      'Prédicateur',
      'Missionnaire'
    ]
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

  NO_LEVEL = 'Non renseigné'.freeze

  # Reconnaissance la plus récente (à date égale, la dernière saisie).
  def level
    g = gratitudes.order(start_at: :desc, id: :desc).first

    if g
      g.level
    else
      NO_LEVEL
    end
  end

  # Même règle que #level pour tous les utilisateurs en une requête : { user_id => niveau }.
  # Les utilisateurs sans reconnaissance sont absents (niveau NO_LEVEL).
  def self.current_levels(user_ids = nil)
    careers = Career.where.not(level: nil)
    careers = careers.where(user_id: user_ids) unless user_ids.nil?
    careers.pluck(:user_id, :level, :start_at, :id)
           .group_by(&:first)
           .transform_values { |rows| rows.max_by { |_, _, start_at, id| [start_at ? 1 : 0, start_at || Date.new(1), id] }[1] }
  end

  # User.accept_invitation! : on garde la version de devise_invitable, qui cherche
  # l'empreinte du jeton et renvoie une erreur si le jeton est absent ou invalide.
  # (L'ancienne surcharge cherchait `invitation_token: nil` sans jeton et laissait
  # changer le mot de passe du premier compte venu.)

  def self.allowed_params params
    if params[:user][:password].blank?
      params[:user].except(:id, :encrypted_password, :sign_in_count, :created_at, :updated_at, :invitations_count, :disabled, :authentication_token)
                   .permit(:firstname, :lastname, :avatar, :address_1,
                           :address_2, :zipcode, :town, :phone_1, :phone_2,
                           :email, :birthdate, :avatar, :biography, :fcm_token, :push_enabled,
                           fees_attributes: [:id, :what, :paid_at, :amount, :_destroy],
                           gratitudes_attributes: [:id, :level, :referent_id, :start_at, :_destroy],
                           phases_attributes: [:id, :church_id, :function, :start_at, :end_at, :_destroy],
                           responsabilities_attributes: [:id, :association_id, :function, :start_at, :end_at, :_destroy])
    else
      params[:user].except(:id, :encrypted_password, :sign_in_count, :created_at, :updated_at, :invitations_count, :disabled, :authentication_token)
                   .permit(:firstname, :lastname, :avatar, :address_1,
                           :address_2, :zipcode, :town, :phone_1, :phone_2, :biography,
                           :email, :birthdate, :password, :password_confirmation, :avatar, :fcm_token, :push_enabled,
                           fees_attributes: [:id, :what, :paid_at, :amount, :_destroy],
                           gratitudes_attributes: [:id, :level, :referent_id, :start_at, :_destroy],
                           phases_attributes: [:id, :church_id, :function, :start_at, :end_at, :_destroy],
                           responsabilities_attributes: [:id, :association_id, :function, :start_at, :end_at, :_destroy])
    end
  end
end
