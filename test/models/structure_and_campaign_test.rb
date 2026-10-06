require "test_helper"

# Logique utilisée par l'API sur les structures et les campagnes : membres et
# président d'une structure, cycle de vie et dépouillement d'une campagne,
# règle de la table des votes.
class StructureAndCampaignTest < ActiveSupport::TestCase
  def setup
    @association = structures(:association)
    @church = structures(:church)
    @user = users(:simple)
    @other = users(:other)
  end

  test "membres d'une structure : utilisateurs et structures, avec leur rôle" do
    @user.add_role :president, @association
    @other.add_role :member, @association
    Membership.create!(structure: @association, member: @church, role: Role.find_or_create_by!(name: 'member'), can_vote: false)

    rows = @association.members_with_details.map { |m| [m.member_type, m.member_id, m.role_name] }
    assert_equal [['Structure', @church.id, 'member'], ['User', @other.id, 'member'], ['User', @user.id, 'president']].sort, rows.sort
    assert_equal [@other.id, @user.id].sort, @association.users.pluck(:id).sort
    assert_equal @user, @association.president
  end

  test "une structure exige un nom ; la suppression retire ses adhésions et campagnes" do
    assert_not Association.new(name: '').valid?

    @user.add_role :member, @association
    Campaign.create!(name: 'AG', structure: @association)
    @association.destroy
    assert_equal 0, Membership.where(structure_id: @association.id).count
    assert_equal 0, Campaign.where(structure_id: @association.id).count
  end

  test "une église et une région sont géocodées à l'enregistrement" do
    church = Church.create!(name: 'Église', address_1: '1 rue de Paris', zipcode: '75001', town: 'Paris')
    assert_equal '1 rue de Paris 75001 Paris', church.full_address
    assert_in_delta 48.8566, church.latitude
    assert_in_delta 2.3522, Region.create!(name: 'Région', town: 'Paris').longitude
  end

  test "cycle de vie d'une campagne" do
    campaign = Campaign.create!(name: 'AG', structure: @association)
    assert campaign.coming?
    assert campaign.opening
    assert campaign.opened?
    assert campaign.close_temporarily
    assert campaign.coming?
    assert campaign.close_definitly
    assert campaign.closed?
    assert_not campaign.opening, "une campagne clôturée ne se rouvre pas"

    assert_equal [], Campaign.currents.where(id: campaign.id).to_a
    assert_not Campaign.new(name: 'Sans structure').valid?
    assert_equal 'Business One', campaign.structure_name
  end

  test "dépouillement : voix, choix, réponses libres et votants" do
    campaign = Campaign.create!(name: 'AG', structure: @association, state: 'opened')
    binary = campaign.motions.create!(name: 'Budget', kind: 'binary', order: 1)
    choices = campaign.motions.create!(name: 'Élection', kind: 'choices', order: 2)
    free = campaign.motions.create!(name: 'Remarques', kind: 'free', order: 3)

    Vote.create!(motion: binary, result: 'Oui', is_consultative: false)
    Vote.create!(motion: binary, result: 'Non', is_consultative: true)
    Vote.create!(motion: choices, result: 'A', is_consultative: false)
    Vote.create!(motion: choices, result: 'A', is_consultative: false)
    Vote.create!(motion: free, result: 'Merci', is_consultative: false)
    Voter.create!(motion: binary, voted_at: Time.now, ip: '127.0.0.1', resource: @user)
    Voter.create!(motion: binary, voted_at: Time.now, ip: '127.0.0.1', resource: @church)

    result = campaign.results.first
    assert_equal 1, result.non_consultative_yes_count.to_i
    assert_equal 1, result.consultative_no_count.to_i
    assert campaign.has_consultative_votes?

    choice = campaign.choices_results.first
    assert_equal ['A', 2], [choice.choice, choice.count]
    assert_equal 'Merci', campaign.free_results.first.non_consultative_free
    assert_equal ['Church One', 'User Simple'].sort, campaign.voters.map(&:name).sort
  end

  test "sans vote consultatif" do
    campaign = Campaign.create!(name: 'AG', structure: @association)
    assert_not campaign.has_consultative_votes?
  end

  test "règle de la table des votes : qualité comparée sans casse ni espaces finaux" do
    tables = [VotingTable.new(position: 'Pasteur APE ', as_member: true, voting: 'count'),
              VotingTable.new(position: 'Eglises', as_member: false, voting: 'consultative')]

    assert_equal tables[0], Campaign.voting_table_for(tables, 'pasteur ape', true)
    assert_nil Campaign.voting_table_for(tables, 'Pasteur APE', false)
    assert_equal tables[1], Campaign.voting_table_for(tables, 'EGLISES', false)
    assert_not Campaign.same_position?(nil, 'Eglises')
    assert Campaign.consultative?(tables[1])
    assert_not Campaign.consultative?(tables[0])
    assert Campaign.vote_blocked?(false)
    assert_not Campaign.vote_blocked?(nil)
  end

  test "le bulletin sérialisé garde la forme attendue par les applications" do
    ballot = Campaign::Ballot.new(name: 'X', town: 'Lyon', resource_id: 1, resource_type: 'User', can_vote: 1, is_consultative: 0, has_voted: nil)
    assert_equal({ 'name' => 'X', 'town' => 'Lyon', 'resource_id' => 1, 'resource_type' => 'User', 'can_vote' => 1,
                   'is_consultative' => 0, 'has_voted' => nil, 'id' => nil }, ballot.as_json)
  end
end
