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
    "Du #{I18n.l self.start_at} au #{I18n.l self.end_at}"
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

    logger.debug vt.inspect

    if as_member
      can_vote = structure.member_can_vote?(voting_structure)

      logger.debug can_vote.inspect

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
            .where('motions.kind <> ?', 'free')
            .select("
                      motions.id,
                      motions.name AS motion_name,
                      SUM(CASE WHEN votes.result = 'Oui' AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_yes_count,
                      SUM(CASE WHEN votes.result = 'Non' AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_no_count,
                      SUM(CASE WHEN (votes.result = 'Neutre' OR votes.result IS NULL) AND votes.is_consultative = FALSE THEN 1 ELSE 0 END) AS non_consultative_neutre_count,
                      SUM(CASE WHEN votes.result = 'Oui' AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_yes_count,
                      SUM(CASE WHEN votes.result = 'Non' AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_no_count,
                      SUM(CASE WHEN (votes.result = 'Neutre' OR votes.result IS NULL) AND votes.is_consultative = TRUE THEN 1 ELSE 0 END) AS consultative_neutre_count")
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

end
