require "test_helper"

# Parcours de vote complet, du point de vue de l'électeur.
#
# Règles (table des votes de la campagne, une ligne = qualité + membre / non-membre + mode) :
# - un pasteur vote pour lui-même si une ligne correspond à son niveau de reconnaissance ET
#   à sa situation vis-à-vis de la structure organisatrice (membre ou non-membre) ;
# - le président d'une église (qualité « Eglises ») ou d'une œuvre (qualité « Oeuvres »)
#   vote en plus au nom de sa structure, selon que celle-ci est membre ou non ;
# - « Comptabilisé » compte dans les résultats officiels, « Consultatif » à part ;
# - un bulletin bloqué par la structure (can_vote) est affiché mais refusé ;
# - chaque bulletin ne sert qu'une fois, et seulement pendant l'ouverture de la campagne.
class Api::VoteProcessTest < ActionDispatch::IntegrationTest
  LEVEL = 'Pasteur APE'.freeze

  def setup
    @pastor = users(:simple)
    @pastor.gratitudes.create!(level: LEVEL, start_at: Date.new(2020, 1, 1))
    @headers = auth_headers(@pastor)

    @organizer = Association.create!(name: 'ADD Organisatrice')
    @church    = Church.create!(name: 'Église de Lyon', town: 'Lyon')
    @oeuvre    = Association.create!(name: 'Œuvre Jeunesse', town: 'Paris')
    Role.find_or_create_by!(name: 'president')
    Role.find_or_create_by!(name: 'member')

    @campaign = @organizer.campaigns.create!(name: 'AG 2026')
    @motion   = @campaign.motions.create!(name: 'Rapport moral', kind: 'binary', order: 1)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def table(position, member:, voting: 'count')
    @campaign.voting_tables.create!(position: position, as_member: member, voting: voting)
  end

  def open!
    @campaign.update!(state: 'opened')
  end

  # Bulletins affichés à l'électeur : { [type, id] => bulletin }
  def ballots(headers = @headers)
    get "/api/votes/#{@campaign.id}", headers: headers
    assert_response :success
    json['voters'].index_by { |b| [b['resource_type'], b['resource_id']] }
  end

  def my_ballot(headers = @headers)
    ballots(headers)[['User', @pastor.id]]
  end

  def vote(electors, answer = 'oui', headers = @headers)
    post '/api/votes', params: {
      campaign_id: @campaign.id,
      voters: electors.map { |e| { resource_id: e.id, resource_type: e.class.base_class.name, selected: true } },
      results: [{ motion_id: @motion.id, vote: answer }]
    }, headers: headers, as: :json
    assert_response :success
  end

  def listed?(headers = @headers)
    get '/api/votes', headers: headers
    json['campaigns'].map { |c| c['id'] }.include?(@campaign.id)
  end

  # ---------- Pasteur : membre ou non-membre ----------

  test "pasteur membre, niveau dans la table pour les membres : vote comptabilisé" do
    @pastor.add_role :member, @organizer
    table(LEVEL, member: true)
    open!

    ballot = my_ballot
    assert_equal({ 'name' => 'Simple User', 'can_vote' => 1, 'is_consultative' => 0, 'has_voted' => nil },
                 ballot.slice('name', 'can_vote', 'is_consultative', 'has_voted'))
    assert listed?

    vote([@pastor])
    assert_equal ['oui'], Vote.where(motion: @motion).pluck(:result)
    assert_equal [false], Vote.where(motion: @motion).pluck(:is_consultative)
    assert_equal 1, my_ballot['has_voted']
    assert_not listed?, "la campagne disparaît de la liste une fois le bulletin utilisé"
  end

  test "pasteur membre, ligne consultative : vote compté à part" do
    @pastor.add_role :member, @organizer
    table(LEVEL, member: true, voting: 'consultative')
    open!

    assert_equal 1, my_ballot['is_consultative']
    vote([@pastor])
    assert_equal [true], Vote.where(motion: @motion).pluck(:is_consultative)
  end

  test "pasteur non membre, la table ouvre le vote aux non-membres : il vote" do
    table(LEVEL, member: false, voting: 'consultative')
    open!

    ballot = my_ballot
    assert ballot, "un pasteur non membre doit recevoir un bulletin"
    assert_equal 1, ballot['can_vote']
    assert_equal 1, ballot['is_consultative']
    assert listed?

    vote([@pastor])
    assert_equal 1, Voter.where(motion: @motion, resource_type: 'User', resource_id: @pastor.id).count
  end

  test "pasteur non membre, la table ne prévoit que les membres : pas de bulletin" do
    table(LEVEL, member: true)
    open!

    assert_nil my_ballot
    assert_not listed?
    vote([@pastor])
    assert_equal 0, Vote.count
  end

  test "pasteur membre, la table ne prévoit que les non-membres : pas de bulletin" do
    @pastor.add_role :member, @organizer
    table(LEVEL, member: false)
    open!

    assert_nil my_ballot
    vote([@pastor])
    assert_equal 0, Vote.count
  end

  test "membres comptabilisés et non-membres consultatifs sur le même niveau" do
    table(LEVEL, member: true, voting: 'count')
    table(LEVEL, member: false, voting: 'consultative')
    open!

    assert_equal 1, my_ballot['is_consultative'], "non membre : consultatif"
    @pastor.add_role :member, @organizer
    assert_equal 0, my_ballot['is_consultative'], "membre : comptabilisé"
    assert_equal 1, ballots.size
  end

  test "niveau absent de la table ou non renseigné : pas de bulletin" do
    @pastor.add_role :member, @organizer
    table('Probatoire', member: true)
    open!
    assert_nil my_ballot

    other = users(:other)
    other.add_role :member, @organizer
    table('Non renseigné', member: true)
    assert_equal ['Non renseigné'], [other.level]
    get "/api/votes/#{@campaign.id}", headers: auth_headers(other)
    assert_equal 1, json['voters'].size, "seule une ligne explicite « Non renseigné » ouvre le vote"
  end

  test "le niveau retenu est la reconnaissance la plus récente" do
    @pastor.add_role :member, @organizer
    @pastor.gratitudes.create!(level: 'Probatoire', start_at: Date.new(2015, 1, 1))
    table(LEVEL, member: true)
    open!
    assert my_ballot

    @pastor.gratitudes.create!(level: 'Pasteur stagiaire', start_at: Date.new(2024, 1, 1))
    assert_nil my_ballot
  end

  test "un membre bloqué voit son bulletin mais ne peut pas voter" do
    @pastor.add_role :member, @organizer
    @organizer.memberships.find_by(member: @pastor).update!(can_vote: false)
    table(LEVEL, member: true)
    open!

    assert_equal 0, my_ballot['can_vote']
    assert listed?, "la campagne reste listée pour afficher le blocage"
    vote([@pastor])
    assert_equal 0, Vote.count
  end

  # ---------- Président d'église ou d'œuvre ----------

  test "président d'une église membre : vote au nom de son église" do
    @pastor.add_role :president, @church
    @church.add_role :member, @organizer
    table('Eglises', member: true)
    open!

    church_ballot = ballots[['Structure', @church.id]]
    assert_equal 'Église de Lyon', church_ballot['name']
    assert_equal 'Lyon', church_ballot['town']
    assert_equal 0, church_ballot['is_consultative']
    assert listed?

    vote([@church])
    assert_equal 1, Voter.where(motion: @motion, resource_type: 'Structure', resource_id: @church.id).count
    assert_equal 1, Vote.where(motion: @motion).count
    assert_equal 1, ballots[['Structure', @church.id]]['has_voted']
  end

  test "président d'une œuvre membre : vote au nom de son œuvre" do
    @pastor.add_role :president, @oeuvre
    @oeuvre.add_role :member, @organizer
    table('Oeuvres', member: true, voting: 'consultative')
    open!

    oeuvre_ballot = ballots[['Structure', @oeuvre.id]]
    assert_equal 'Œuvre Jeunesse', oeuvre_ballot['name']
    assert_equal 1, oeuvre_ballot['is_consultative']

    vote([@oeuvre])
    assert_equal [true], Vote.where(motion: @motion).pluck(:is_consultative)
  end

  test "pasteur membre et président d'église et d'œuvre : trois bulletins utilisés en une fois" do
    @pastor.add_role :member, @organizer
    @pastor.add_role :president, @church
    @pastor.add_role :president, @oeuvre
    @church.add_role :member, @organizer
    @oeuvre.add_role :member, @organizer
    table(LEVEL, member: true)
    table('Eglises', member: true)
    table('Oeuvres', member: true)
    open!

    assert_equal [['Structure', @church.id], ['Structure', @oeuvre.id], ['User', @pastor.id]], ballots.keys.sort_by(&:to_s)

    vote([@pastor, @church, @oeuvre], 'non')
    assert_equal 3, Voter.where(motion: @motion).count
    assert_equal %w[non non non], Vote.where(motion: @motion).pluck(:result)
    assert_not listed?
  end

  test "église non membre : bulletin seulement si la table ouvre le vote aux non-membres" do
    @pastor.add_role :president, @church
    table('Eglises', member: true)
    open!
    assert_nil ballots[['Structure', @church.id]]
    vote([@church])
    assert_equal 0, Vote.count

    table('Eglises', member: false, voting: 'consultative')
    assert_equal 1, ballots[['Structure', @church.id]]['is_consultative']
  end

  test "un simple membre d'une église ne vote pas en son nom" do
    @pastor.add_role :member, @church
    @church.add_role :member, @organizer
    table('Eglises', member: true)
    open!

    assert_nil ballots[['Structure', @church.id]]
    vote([@church])
    assert_equal 0, Vote.count
  end

  test "une église déjà votée par un co-président n'a plus de bulletin" do
    co_president = users(:other)
    [@pastor, co_president].each { |u| u.add_role :president, @church }
    @church.add_role :member, @organizer
    table('Eglises', member: true)
    open!

    vote([@church], 'oui', auth_headers(co_president))
    assert_equal 1, ballots[['Structure', @church.id]]['has_voted']

    vote([@church], 'non')
    assert_equal ['oui'], Vote.where(motion: @motion).pluck(:result)
  end

  test "une église bloquée par l'organisateur ne vote pas" do
    @pastor.add_role :president, @church
    @church.add_role :member, @organizer
    @organizer.memberships.find_by(member: @church).update!(can_vote: false)
    table('Eglises', member: true)
    open!

    assert_equal 0, ballots[['Structure', @church.id]]['can_vote']
    vote([@church])
    assert_equal 0, Vote.count
  end

  test "le président de l'association organisatrice ne vote pas au nom de celle-ci" do
    @pastor.add_role :president, @organizer
    table('Oeuvres', member: true)
    table('Oeuvres', member: false)
    open!

    assert_nil ballots[['Structure', @organizer.id]]
  end

  # ---------- Cycle de la campagne ----------

  test "à venir : bulletins visibles mais vote refusé ; clôturée : plus listée" do
    @pastor.add_role :member, @organizer
    table(LEVEL, member: true)

    assert my_ballot
    assert listed?, "une campagne à venir est annoncée"
    post '/api/votes', params: { campaign_id: @campaign.id, voters: [{ resource_id: @pastor.id, resource_type: 'User', selected: true }],
                                 results: [{ motion_id: @motion.id, vote: 'oui' }] }, headers: @headers, as: :json
    assert_response :unprocessable_entity

    @campaign.update!(state: 'closed')
    assert_not listed?
  end

  test "dépouillement : voix comptabilisées et consultatives séparées, quelle que soit la casse" do
    other = users(:other)
    other.gratitudes.create!(level: LEVEL, start_at: Date.new(2020, 1, 1))
    @pastor.add_role :member, @organizer
    table(LEVEL, member: true, voting: 'count')
    table(LEVEL, member: false, voting: 'consultative')
    open!

    vote([@pastor], 'oui')
    vote([other], 'non', auth_headers(other))

    admin = users(:admin)
    admin.add_role :admin
    get "/api/campaigns/#{@campaign.id}", headers: auth_headers(admin)
    result = json['results'].first
    assert_equal 1, result['non_consultative_yes_count'].to_i
    assert_equal 0, result['non_consultative_no_count'].to_i
    assert_equal 1, result['consultative_no_count'].to_i
    assert_equal 2, json['voters'].size
  end
end
