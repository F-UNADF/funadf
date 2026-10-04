class Campaign < ActiveRecord::Base
  belongs_to :structure
  has_many :motions, -> { order 'motions.order asc' }, dependent: :destroy
  has_many :voting_tables, dependent: :destroy

  state_machine :state, initial: :coming do

    event :opening do
      transition :coming => :opened
    end
    event :close_temporarily do
      transition :opened => :coming
    end
    event :close_definitly do
      transition [:coming, :opened] => :closed
    end

    state :coming do
      def state_class
        "primary"
      end
    end

    state :opened do
      def state_class
        "success"
      end
    end

    state :closed do
      def state_class
        "warning"
      end
    end

    state :coming, :closed do
      def can_vote?
        false
      end
    end
    state :opened do
      def can_vote?
        true
      end
    end
  end

  accepts_nested_attributes_for :motions, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :voting_tables, reject_if: :all_blank, allow_destroy: true

  delegate :name, to: :structure, prefix: true

  validates :structure_id, presence: true

  def period
    if self.start_at && self.end_at
      "Du #{I18n.l self.start_at} au #{I18n.l self.end_at}"
    else
      ""
    end
  end

  def motions_count
    motions.count
  end

  def has_already_vote? elector
    b = false
    motions.each do |motion|
      if motion.has_voted? elector
        b = true
      end
    end
    b
  end

  # def elector_can_vote? elector
  #   (elector && self.is_public && self.can_vote? && !has_already_vote?(elector)) || (elector && elector.can_vote && self.can_vote? && !has_already_vote?(elector))
  # end

  def get_elector_note elector
    unless elector.blank?
      if !elector.can_vote
        elector.note
      elsif self.closed?
        "Les votes de cette campagne sont cloturés"
      elsif self.coming?
        "Les votes de cette campagne ne sont pas encore ouverts"
      elsif has_already_vote?(elector)
        "Vous avez déjà voté pour cette campagne."
      end
    end
  end

  def self.get_campaigns_for_member user
    electors = user.electors
    Campaign.joins(:structure).where('structure_id IN (?)', electors.pluck(:structure_id)).order('structures.name')
  end

  def self.get_campaigns_for_structure structure
    electors = structure.self_electors
    Campaign.joins(:structure).where('structure_id IN (?)', electors.pluck(:structure_id)).order('structures.name')
  end

  def self.get_campaigns_for_president user
    president_roles = Role.where(name: :president, rolizations: { resource_id: user.id, resource_type: user.get_class }).joins(:rolizations)
    campaigns       = []
    president_roles.each do |role|
      structure = role.resource
      campaigns = campaigns + structure.campaigns
    end
    campaigns
  end

  def self.get_public_campaigns user
    Campaign.where(is_public: true).where('ID NOT IN (?)', self.get_campaigns_for_member(user).pluck(:id))
  end

  def self.currents
    Campaign.with_states([:coming, :opened]).order(name: :asc)
  end

  def get_voters opts = nil
    motion_ids = Motion.where(campaign_id: self.id).pluck(:id)
    if opts[:only_electors] && opts[:only_electors] == true
      Voter.where('motion_id IN (?) AND elector_id IS NOT NULL', motion_ids).group(:elector_id).count.count
    else
      Voter.where('motion_id IN (?) AND elector_id IS NULL', motion_ids).group([:resource_id, :resource_type]).count.count
    end
  end

  def user_can_vote?(user, as_member = true)
    user_level = user.level
    structure  = self.structure

    vt = self.voting_tables.where(position: user_level, as_member: as_member).first

    if as_member
      can_vote = structure.member_can_vote?(user)

      can_vote && (vt && (vt.voting == 'count' || vt.voting == 'consultative'))
    else
      (vt && (vt.voting == 'count' || vt.voting == 'consultative'))
    end
  end

  def user_vote_kind(user, as_member = true)
    user_level = user.level
    structure  = self.structure

    vt = self.voting_tables.where(position: user_level, as_member: as_member).first

    if vt
      vt.voting
    else
      nil
    end
  end

  def users_churches_can_vote(user)
    structure          = self.structure
    church_presidences = user.church_presidences
    can_vote           = false

    church_presidences.each do |church|
      is_member = structure.member_can_vote?(church)

      vt = self.voting_tables.where(position: ((is_member) ? 'eglises membres' : 'eglises non membres'), as_member: is_member)

      can_vote = (vt == 'count' || vt == 'consultative')
      exit if can_vote
    end
    can_vote
  end

  def structure_can_vote?(voting_structure, as_member = true)
    structure = self.structure

    if voting_structure.type == "Church"
      vt = self.voting_tables.where(position: (as_member) ? 'eglises membres' : 'eglises non membres', as_member: as_member).first
    else
      vt = self.voting_tables.where(position: (as_member) ? 'oeuvres membres' : 'oeuvres non membres', as_member: as_member).first
    end

    if as_member
      can_vote = structure.member_can_vote?(voting_structure)
      can_vote && (vt && (vt.voting == 'count' || vt.voting == 'consultative'))
    else
      (vt && (vt.voting == 'count' || vt.voting == 'consultative'))
    end
  end

  def structure_vote_kind(voting_structure, as_member = true)
    structure = self.structure

    if voting_structure.type == "Church"
      vt = self.voting_tables.where(position: (as_member) ? 'eglises membres' : 'eglises non membres', as_member: as_member).first
    else
      vt = self.voting_tables.where(position: (as_member) ? 'oeuvres membres' : 'oeuvres non membres', as_member: as_member).first
    end

    if vt
      vt.voting
    else
      nil
    end
  end

  def has_consultative_votes?
    Vote.where(motion_id: self.motions.pluck(:id)).where(is_consultative: true).count > 0
  end

  def voters
    sql = "
        SELECT s.id, s.name, s.town
        FROM voters v
        JOIN structures s ON s.id = v.resource_id
        LEFT JOIN motions m ON m.id = v.motion_id
        JOIN campaigns c ON c.id = m.campaign_id
        WHERE v.resource_type = 'Structure'
        AND c.id = :campaign_id
        UNION
        SELECT u.id, CONCAT(u.lastname, ' ', u.firstname), u.town
        FROM voters v
        JOIN users u ON u.id = v.resource_id
        LEFT JOIN motions m ON m.id = v.motion_id
        JOIN campaigns c ON c.id = m.campaign_id
        WHERE v.resource_type = 'User'
        AND c.id = :campaign_id"

    Campaign.find_by_sql([sql, campaign_id: self.id])
  end


  def results
    Campaign.joins(motions: :votes)
            .where(id: self.id)
            .group('motions.id')
            .where("motions.kind NOT IN ('free', 'choices')")
            .select("
                      motions.id,
                      motions.name AS motion_name,
                      SUM(CASE WHEN votes.result = 'Oui' AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_yes_count,
                      SUM(CASE WHEN votes.result = 'Non' AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_no_count,
                      SUM(CASE WHEN votes.result = 'Neutre' AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_neutre_count,
                      SUM(CASE WHEN votes.result IS NULL AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_null_count,

                      SUM(CASE WHEN votes.result = 'Oui' AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_yes_count,
                      SUM(CASE WHEN votes.result = 'Non' AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_no_count,
                      SUM(CASE WHEN votes.result = 'Neutre' AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_neutre_count,
                      SUM(CASE WHEN votes.result IS NULL AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_null_count")
  end

  def choices_results
    Campaign.joins(motions: :votes)
            .where(id: self.id)
            .group('motions.id, motions.name, votes.result, votes.is_consultative')
            .where("motions.kind = ?", 'choices')
            .order('count DESC')
            .select("
                      motions.id,
                      motions.name AS motion_name,
                      votes.result AS choice,
                      votes.is_consultative AS consultative,
                      COUNT(votes.motion_id) AS count")
  end

  def free_results
    Campaign.joins(motions: :votes)
            .where(id: self.id)
            .where('motions.kind = ?', 'free')
            .group('motions.id')
            .select("
                      motions.id,
                      motions.name AS motion_name,
                      GROUP_CONCAT(CASE WHEN votes.is_consultative = FALSE THEN votes.result ELSE NULL END SEPARATOR ', ') AS non_consultative_free,
                      GROUP_CONCAT(CASE WHEN votes.is_consultative = TRUE THEN votes.result ELSE NULL END SEPARATOR ', ') AS consultative_free")
  end

  # Bulletin d'un électeur. Le JSON (lu par la webapp et l'app mobile) garde la forme
  # de l'ancienne requête SQL : can_vote et is_consultative valent 0 / 1, has_voted
  # vaut null tant que l'électeur n'a pas voté.
  Ballot = Struct.new(:name, :town, :resource_id, :resource_type, :can_vote, :is_consultative, :has_voted, keyword_init: true) do
    def as_json(*)
      to_h.merge(id: nil).stringify_keys
    end
  end

  # Qualité de vote d'une structure dans la table des votes.
  STRUCTURE_POSITIONS = { 'Church' => 'Eglises', 'Association' => 'Oeuvres' }.freeze

  # Règle d'éligibilité, partagée par #ballots_for (bulletins d'un électeur) et
  # CampaignElectorate (estimation pendant la préparation de la table des votes) :
  # la première ligne de la table qui correspond à la qualité de l'électeur ET à sa
  # situation vis-à-vis de la structure organisatrice (membre ou non) s'applique.
  def self.voting_table_for(tables, position, as_member)
    tables.find { |table| table.as_member == as_member && same_position?(table.position, position) }
  end

  # Comparaison à la manière de MySQL (casse et espaces finaux ignorés).
  def self.same_position?(a, b)
    a.present? && b.present? && a.to_s.rstrip.casecmp?(b.to_s.rstrip)
  end

  # Une adhésion bloquée (can_vote à false) donne un bulletin inutilisable.
  def self.vote_blocked?(can_vote)
    can_vote == false
  end

  def self.consultative?(table)
    table.voting != 'count'
  end

  # Églises et œuvres qui votent par leur président, hors structure organisatrice.
  def voting_structures
    Structure.joins(memberships: :role)
             .where(type: STRUCTURE_POSITIONS.keys, roles: { name: 'president' },
                    memberships: { member_type: 'User' })
             .where.not(id: structure_id)
             .distinct
  end

  # Bulletins dont dispose `user` pour cette campagne, d'après la table des votes :
  # - les églises et œuvres qu'il préside (qualités « Eglises » / « Oeuvres ») ;
  # - lui-même, selon son niveau de reconnaissance.
  # Chaque ligne de la table vaut pour les membres OU pour les non-membres de la
  # structure organisatrice (adhésion directe). Une adhésion bloquée (can_vote)
  # donne un bulletin affiché mais inutilisable.
  def ballots_for(user)
    voted  = Voter.joins(:motion).where(motions: { campaign_id: id }).group(:resource_type, :resource_id).count
    tables = voting_tables.order(:id).to_a

    ballots = presided_structures(user).filter_map do |presided|
      ballot(presided, presided.name, presided.town, STRUCTURE_POSITIONS[presided.type], voted, tables)
    end
    ballots << ballot(user, "#{user.firstname} #{user.lastname}", user.town, user.level, voted, tables)
    ballots.compact
  end

  private

  def presided_structures(user)
    voting_structures.where(memberships: { member_id: user.id })
  end

  def ballot(elector, name, town, position, voted, tables)
    resource_type = elector.class.base_class.name
    membership    = structure.memberships.where(member_type: resource_type, member_id: elector.id).order(:id).first
    table         = Campaign.voting_table_for(tables, position, membership.present?)
    return unless table

    Ballot.new(
      name:            name,
      town:            town,
      resource_id:     elector.id,
      resource_type:   resource_type,
      can_vote:        Campaign.vote_blocked?(membership&.can_vote) ? 0 : 1,
      is_consultative: Campaign.consultative?(table) ? 1 : 0,
      has_voted:       voted[[resource_type, elector.id]]
    )
  end
end
