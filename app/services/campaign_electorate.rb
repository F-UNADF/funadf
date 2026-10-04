# Corps électoral d'une campagne, pour aider à préparer la table des votes :
# - statistiques des membres directs de la structure organisatrice ;
# - estimation du nombre de bulletins, ligne par ligne, pour une table des votes
#   enregistrée ou non (celle du formulaire en cours de saisie).
#
# L'estimation applique la règle de Campaign#ballots_for (Campaign.voting_table_for,
# Campaign.vote_blocked?, Campaign#voting_structures) à tous les électeurs possibles :
# - chaque utilisateur actif (User.enabled), selon son niveau de reconnaissance ;
# - chaque église ou œuvre présidée par un utilisateur actif, hors organisatrice.
# C'est un maximum : chaque bulletin ne compte que s'il est utilisé.
class CampaignElectorate
  Elector = Struct.new(:position, :member, :blocked, keyword_init: true)

  attr_reader :structure, :tables

  # tables : lignes de la table des votes (VotingTable, enregistrées ou non), dans l'ordre.
  def initialize(structure, tables)
    @structure = structure
    @tables    = tables.to_a
  end

  def as_json(*)
    {
      structure: { id: structure.id, name: structure.name, type: structure.type },
      members:   members,
      estimate:  estimate
    }
  end

  # Membres directs de l'organisatrice, par type.
  def members
    user_ids      = member_ids('User')
    active_ids    = User.enabled.where(id: user_ids).pluck(:id)
    levels        = User.current_levels(active_ids)
    by_level      = active_ids.map { |id| levels[id] || User::NO_LEVEL }.tally
    structures    = Hash[Structure.where(id: member_ids('Structure')).pluck(:id, :type)]
    with_president = presided_structure_ids

    {
      total:     user_ids.size + structures.size,
      blocked:   memberships.count { |_, can_vote| Campaign.vote_blocked?(can_vote) },
      pastors:   {
        total:    active_ids.size,
        disabled: user_ids.size - active_ids.size,
        by_level: sort_levels(by_level).map { |level, count| { level: level, count: count } }
      },
      churches:  structure_stats(structures, 'Church', with_president),
      oeuvres:   structure_stats(structures, 'Association', with_president),
      others:    structures.count { |_, type| !Campaign::STRUCTURE_POSITIONS.key?(type) }
    }
  end

  # Bulletins potentiels, au total et par ligne de la table.
  # Une ligne en double (même qualité, même situation) ne reçoit personne :
  # seule la première s'applique.
  def estimate
    lines = tables.each_with_index.map do |table, index|
      first = tables.index { |other| other.as_member == table.as_member && Campaign.same_position?(other.position, table.position) }
      { position: table.position, as_member: table.as_member, voting: table.voting,
        voters: 0, blocked: 0, duplicate: !first.nil? && first != index }
    end
    totals = { count: 0, consultative: 0, blocked: 0 }

    electors.each do |elector|
      table = Campaign.voting_table_for(tables, elector.position, elector.member)
      next unless table

      line = lines[tables.index { |t| t.equal?(table) }]
      if elector.blocked
        line[:blocked]   += 1
        totals[:blocked] += 1
      else
        line[:voters] += 1
        totals[Campaign.consultative?(table) ? :consultative : :count] += 1
      end
    end

    totals.merge(lines: lines)
  end

  # Tous les électeurs possibles, quelle que soit la table.
  def electors
    @electors ||= user_electors + structure_electors
  end

  private

  def user_electors
    ids    = User.enabled.pluck(:id)
    levels = User.current_levels
    ids.map { |id| elector('User', id, levels[id] || User::NO_LEVEL) }
  end

  def structure_electors
    types = Structure.where(id: presided_structure_ids).pluck(:id, :type)
    types.map { |id, type| elector('Structure', id, Campaign::STRUCTURE_POSITIONS[type]) }
  end

  def elector(type, id, position)
    key = [type, id]
    Elector.new(position: position, member: memberships.key?(key), blocked: Campaign.vote_blocked?(memberships[key]))
  end

  # Adhésions directes à l'organisatrice : { [member_type, member_id] => can_vote }.
  # Comme Campaign#ballots_for, la plus ancienne adhésion d'un membre fait foi.
  def memberships
    @memberships ||= structure.memberships.order(:id)
                              .pluck(:member_type, :member_id, :can_vote)
                              .each_with_object({}) { |(type, id, can_vote), h| h[[type, id]] = can_vote unless h.key?([type, id]) }
  end

  def member_ids(type)
    memberships.keys.select { |t, _| t == type }.map(&:last)
  end

  # Églises et œuvres votantes : présidées par un utilisateur actif.
  def presided_structure_ids
    @presided_structure_ids ||= Campaign.new(structure: structure, structure_id: structure.id)
                                        .voting_structures
                                        .where(memberships: { member_id: User.enabled.select(:id) })
                                        .pluck(:id)
  end

  def structure_stats(structures, type, with_president)
    ids = structures.select { |_, t| t == type }.keys
    { total: ids.size, without_president: (ids - with_president).size }
  end

  # Ordre de la liste des reconnaissances, puis les autres niveaux, « Non renseigné » en dernier.
  def sort_levels(counts)
    order = User.get_levels
    counts.sort_by do |level, _|
      [level == User::NO_LEVEL ? 2 : (order.include?(level) ? 0 : 1), order.index(level) || 0, level.to_s]
    end
  end
end
