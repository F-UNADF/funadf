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

  def users
    User.where('users.id IN (?)', Membership.where(structure_id: self.id, member_type: 'User').pluck(:member_id)).order(lastname: :asc)
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

  def add_role role_name, structure=nil, can_vote=true, reason=nil
    # Crée un rôle seul (Valable sur l'ensemble de l'APP)
    # OU Avec une Class (Valable uniquement sur cette Class)
    # OU Avec une resource (Valable que pour cette resource)

    role = Role.find_or_create_by(name: role_name)
    Membership.find_or_create_by(role: role, member: self, structure: structure, can_vote: can_vote, reason: reason)

    role
  end
end
