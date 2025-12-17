class Structure < ActiveRecord::Base

  has_many :campaigns, dependent: :destroy
  has_many :events, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :posts, dependent: :destroy

  has_many :memberships, dependent: :destroy

  has_one :president_membership,
          -> { joins(:role).where(roles: { name: 'president' }) },
          class_name: 'Membership',
          foreign_key: 'structure_id'

  has_one :president,
          through: :president_membership,
          source: :member,
          source_type: 'User'

  has_one_attached :logo

  validates :name, :type, presence: true

  def friendly_id
    sprintf '%05d', id
  end

  def users
    User.where('users.id IN (?)', Membership.where(structure_id: self.id, member_type: 'User').pluck(:member_id)).order(lastname: :asc)
  end

  def structures
    Structure.where('structures.id IN (?)', Membership.where(structure_id: self.id, member_type: 'Structure').pluck(:member_id)).order(town: :asc)
  end

  def churches
    Church.where('structures.id IN (?)', Membership.where(structure_id: self.id, member_type: 'Structure').pluck(:member_id)).order(town: :asc)
  end

  def members
    (users + structures)
  end

  def members_with_details
    Membership.find_by_sql(
      "SELECT m.id AS membership_id,
              m.member_id AS member_id,
              m.member_type AS member_type,
              s.name AS name,
              s.zipcode AS zipcode,
              s.town AS town,
              m.role_id AS role_id,
              r.name AS role_name,
              r.friendly_name AS role_friendly_name,
              m.can_vote AS can_vote
        FROM memberships m
        LEFT JOIN structures s ON m.member_id = s.id
        LEFT JOIN roles r ON r.id = m.role_id
        WHERE m.structure_id = #{self.id}
        AND m.member_type = 'Structure'
        UNION
        SELECT m.id AS membership_id,
              m.member_id AS member_id,
              m.member_type AS member_type,
              CONCAT(u.lastname, ' ', u.firstname) AS name,
              u.zipcode AS zipcode,
              u.town AS town,
              m.role_id AS role_id,
              r.name AS role_name,
              r.friendly_name AS role_friendly_name,
              m.can_vote AS can_vote
        FROM memberships m
        LEFT JOIN users u ON m.member_id = u.id
        LEFT JOIN roles r ON r.id = m.role_id
        WHERE m.structure_id = #{self.id}
        AND m.member_type = 'User'")
  end

  def full_address
    [address_1, address_2, zipcode, town].compact.join(' ')
  end

  def self.global_search q
    where(['(name LIKE ? OR email LIKE ? OR id LIKE ? OR town LIKE ?)', "%#{q}%", "%#{q}%", "%#{q}%", "%#{q}%"])
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
    membership = Membership.where(structure_id: self.id, member: resource).first
    (membership.blank?) ? 'other' : membership.role_name
  end

  def get_resource_role(resource)

    results = Membership.where(structure_id: self.id, member: resource).joins(:role).pluck(:name).map{ |r| I18n.t 'activerecord.attributes.roles.names.'+r}.join(', ')

    if results.blank?
      "<em>Pas membre</em>".html_safe
    else
      results
    end
  end

  def add_role role_name, structure=nil, can_vote=true, reason=nil
    # Crée un rôle seul (Valable sur l'ensemble de l'APP)
    # OU Avec une Class (Valable uniquement sur cette Class)
    # OU Avec une resource (Valable que pour cette resource)

    role = Role.find_or_create_by(name: role_name)
    Membership.find_or_create_by(role: role, member: self, structure: structure, can_vote: can_vote, reason: reason)

    role
  end
  def remove_role role_name, structure = nil
    role = Role.find_or_create_by(name: role_name)
    membership = self.memberships.where(role: role, structure: structure)

    membership.destroy unless membership.blank?

    role
  end

  def get_class
    Structure.to_s
  end

  #CHECK IF RESOURCE IS MEMBER OF STRUCTURE
  def is_member?(resource)
    !Membership.where(structure_id: self.id, member: resource).blank?
  end

  def member_can_vote?(resource)
    m = Membership.where(structure: self, member: resource).first

    return !m.blank? && m.can_vote
  end
  def member_cant_vote_note(resource)
    m = Membership.where(structure: self, member: resource).first

    m.reason unless m.blank?
  end
  def member_cant_vote_note_friendly(resource)
    m = Membership.where(structure: self, member: resource).first

    unless m.blank?
      case m.reason
      when 'signing'
        "Il semblerait que vous n'ayez pas émargé."
      when 'contribution'
        "Vous n'êtes pas à jours de vos cotisations."
      else
        "Merci de contacter le responsable des votes de la structure pour plus d'information."
      end
    end

  end

  def self.get_structure_with_president user
    role_presidents = Role.joins(:rolizations).where(roles:{name: :president}, rolizations:{resource_id: user.id, resource_type: user.get_class})
    self.where(id: role_presidents.pluck(:resource_id))
  end

  def president_name
    role = self.roles.where(name: :president).first
    if role
      rolization = Rolization.where(role_id: role.id).first
      if rolization && rolization.resource
        rolization.resource.name
      else
        "Ressource introuvable"
      end
    else
      "Pas de président"
    end
  end


  def gravatar_url
    unless self.email.blank?
      hash = Digest::MD5.hexdigest(self.email)
    else
      hash = Digest::MD5.hexdigest("funadf@yopmail.com")
    end


    return "https://www.gravatar.com/avatar/#{hash}"
  end


  def get_logo_url size=[150,150]
    if self.logo.attached?
      self.logo.variant(resize_to_fill: [500, 500])
    else
      gravatar_url
    end
  end

end
