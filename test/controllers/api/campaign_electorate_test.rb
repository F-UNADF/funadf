require "test_helper"

# Aide à la préparation d'une campagne : POST /api/campaigns/electorate.
# Statistiques des membres directs de l'organisatrice et estimation des bulletins
# pour une table des votes non enregistrée, avec la règle de Campaign#ballots_for.
class Api::CampaignElectorateTest < ActionDispatch::IntegrationTest
  APE = 'Pasteur APE'.freeze

  def setup
    Role.find_or_create_by!(name: 'president')
    Role.find_or_create_by!(name: 'member')
    @admin = users(:admin)
    @admin.add_role :admin
    @organizer = Association.create!(name: 'ADD Organisatrice')

    # Pasteurs : membres (dont un bloqué, un désactivé), non-membres (dont un désactivé)
    @p1 = pastor('Un', APE, member: true)
    @p2 = pastor('Deux', APE, member: true, can_vote: false)
    @p3 = pastor('Trois', 'Probatoire', member: true)
    @p3.gratitudes.create!(level: APE, start_at: Date.new(2010, 1, 1)) # plus ancienne : ignorée
    @p4 = pastor('Quatre', APE)
    @p5 = pastor('Cinq', APE, disabled: true)
    @p6 = pastor('Six', APE, member: true, disabled: true)

    # Églises : membre présidée, membre sans président, non-membre présidée,
    # membre présidée par un compte désactivé, membre bloquée
    @c1 = structure(Church, 'Église 1', member: true, president: @p4)
    @c2 = structure(Church, 'Église 2', member: true)
    @c3 = structure(Church, 'Église 3', president: @p1)
    @c4 = structure(Church, 'Église 4', member: true, president: @p5)
    @c5 = structure(Church, 'Église 5', member: true, president: @p1, can_vote: false)
    # Œuvres : membre présidée, non-membre sans président ; l'organisatrice ne vote pas pour elle-même
    @o1 = structure(Association, 'Œuvre 1', member: true, president: @p4)
    @o2 = structure(Association, 'Œuvre 2')
    @p1.add_role :president, @organizer

    @tables = [
      { position: APE,       as_member: true,  voting: 'count' },
      { position: APE,       as_member: false, voting: 'consultative' },
      { position: 'Eglises', as_member: true,  voting: 'count' },
      { position: 'Eglises', as_member: false, voting: 'consultative' },
      { position: 'Oeuvres', as_member: true,  voting: 'count' },
      { position: 'pasteur ape', as_member: true, voting: 'consultative' } # doublon de la 1re ligne
    ]
    https!
  end

  def pastor(name, level, member: false, can_vote: true, disabled: false)
    user = User.create!(email: "#{name.downcase}@exemple.fr", password: 'motdepasse123',
                        firstname: name, lastname: 'Pasteur', disabled: disabled)
    user.gratitudes.create!(level: level, start_at: Date.new(2020, 1, 1))
    user.add_role :member, @organizer, can_vote if member
    user
  end

  def structure(klass, name, member: false, president: nil, can_vote: true)
    s = klass.create!(name: name, town: 'Lyon')
    s.add_role :member, @organizer, can_vote if member
    president&.add_role :president, s
    s
  end

  def json
    JSON.parse(@response.body)
  end

  def electorate(user = @admin, structure_id: @organizer.id, tables: @tables)
    post '/api/campaigns/electorate', params: { structure_id: structure_id, voting_tables: tables },
                                      headers: auth_headers(user), as: :json
  end

  test "statistiques des membres directs de l'organisatrice" do
    electorate
    assert_response :success
    members = json['members']

    assert_equal({ 'id' => @organizer.id, 'name' => 'ADD Organisatrice', 'type' => 'Association' }, json['structure'])
    assert_equal 9, members['total'], "4 pasteurs + 4 églises + 1 œuvre"
    assert_equal 2, members['blocked']
    assert_equal 3, members['pastors']['total'], "comptes actifs"
    assert_equal 1, members['pastors']['disabled']
    assert_equal [{ 'level' => 'Probatoire', 'count' => 1 }, { 'level' => APE, 'count' => 2 }],
                 members['pastors']['by_level'], "niveau le plus récent, dans l'ordre de la liste des reconnaissances"
    assert_equal({ 'total' => 4, 'without_president' => 2 }, members['churches'])
    assert_equal({ 'total' => 1, 'without_president' => 0 }, members['oeuvres'])
    assert_equal 0, members['others']
  end

  test "estimation d'une table non enregistrée, ligne par ligne" do
    saved = [Campaign.count, VotingTable.count]
    electorate
    assert_response :success
    estimate = json['estimate']

    assert_equal 3, estimate['count'], "p1, Église 1, Œuvre 1"
    assert_equal 2, estimate['consultative'], "p4 et l'Église 3 (non-membres)"
    assert_equal 2, estimate['blocked'], "p2 et l'Église 5"
    assert_equal [[1, 1, false], [1, 0, false], [1, 1, false], [1, 0, false], [1, 0, false], [0, 0, true]],
                 estimate['lines'].map { |l| [l['voters'], l['blocked'], l['duplicate']] }
    assert_equal saved, [Campaign.count, VotingTable.count], "rien n'est enregistré"
  end

  test "sans table des votes : aucun votant estimé" do
    electorate(tables: [])
    assert_response :success
    assert_equal({ 'count' => 0, 'consultative' => 0, 'blocked' => 0, 'lines' => [] }, json['estimate'])
  end

  test "l'estimation correspond aux bulletins réellement donnés par Campaign#ballots_for" do
    campaign = @organizer.campaigns.create!(name: 'AG')
    @tables.each { |t| campaign.voting_tables.create!(t) }

    ballots = User.enabled.flat_map { |u| campaign.ballots_for(u) }.uniq { |b| [b.resource_type, b.resource_id] }
    usable  = ballots.select { |b| b.can_vote == 1 }

    electorate
    estimate = json['estimate']
    assert_equal usable.count { |b| b.is_consultative == 0 }, estimate['count']
    assert_equal usable.count { |b| b.is_consultative == 1 }, estimate['consultative']
    assert_equal ballots.count { |b| b.can_vote == 0 }, estimate['blocked']
  end

  test "un responsable de l'organisatrice y a accès" do
    secretary = users(:other)
    secretary.add_role :secretary, @organizer
    electorate(secretary)
    assert_response :success
  end

  test "un simple membre n'y a pas accès" do
    electorate(@p1.tap { |u| u.memberships.where(structure: @organizer).destroy_all; u.add_role :member, @organizer })
    assert_response :forbidden
  end

  test "un responsable d'une autre structure n'y a pas accès" do
    other = Association.create!(name: 'Autre')
    secretary = users(:other)
    secretary.add_role :secretary, other
    electorate(secretary)
    assert_response :forbidden
  end

  test "structure inconnue : 404" do
    electorate(structure_id: 0)
    assert_response :not_found
  end
end
