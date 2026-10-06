require "test_helper"

# Logique du modèle User réellement utilisée par l'API : rôles, responsabilités,
# niveau de reconnaissance, nettoyage des noms, paramètres autorisés.
class UserTest < ActiveSupport::TestCase
  def setup
    @user = users(:simple)
    @association = structures(:association)
    @region = Region.create!(name: 'Région')
  end

  test "les noms sont nettoyés à l'enregistrement" do
    user = User.create!(email: 'noms@yopmail.com', password: 'motdepasse1', firstname: '  jean-marc ', lastname: ' de la fontaine ')
    assert_equal 'Jean Marc', user.firstname
    assert_equal 'DE LA FONTAINE', user.lastname
    assert_equal 'Jean Marc DE LA FONTAINE', user.fullname
    assert_equal user.fullname, user.name
  end

  test "prénom et nom obligatoires" do
    user = User.new(email: 'vide@yopmail.com', password: 'motdepasse1')
    assert_not user.valid?
    assert user.errors[:firstname].any?
    assert user.errors[:lastname].any?
  end

  test "rôles applicatifs : ajout, test, retrait (y compris d'un rôle absent)" do
    assert_not @user.is_admin?
    assert_not @user.can_switch?

    @user.add_role :moderator
    assert @user.has_role?(:moderator)
    assert @user.can_switch?
    assert_not @user.is_admin?
    assert_equal ['moderator'], @user.application_roles

    @user.add_role :member, @association
    assert_equal ['moderator'], @user.application_roles, "un rôle de structure n'est pas applicatif"

    @user.remove_role :moderator
    assert_not @user.reload.can_switch?
    assert_nothing_raised { @user.remove_role :admin }
  end

  test "un même rôle n'est ajouté qu'une fois" do
    2.times { @user.add_role :admin }
    assert_equal 1, @user.memberships.where(structure_id: nil).count
    assert @user.is_admin?
  end

  test "responsabilités : président, secrétaire, trésorier ou directeur, pas simple membre" do
    other_association = Association.create!(name: 'Autre')
    @user.add_role :member, other_association
    assert_equal [], @user.associations_responsabilities.to_a

    @user.add_role :secretary, @association
    @user.add_role :director, @region
    assert_equal [@association.id], @user.associations_responsabilities.pluck(:id)
    assert_equal [@region.id], @user.regions_responsabilities.pluck(:id)
  end

  test "présidences : structures que l'utilisateur préside" do
    assert_equal [], @user.get_presidences.to_a, "sans rôle président en base"

    church = structures(:church)
    @user.add_role :president, church
    @user.add_role :member, @association
    assert_equal [church.id], @user.get_presidences.map(&:id)
  end

  test "niveau : reconnaissance la plus récente, puis la dernière saisie à date égale" do
    assert_equal User::NO_LEVEL, @user.level

    @user.gratitudes.create!(level: 'Probatoire', start_at: Date.new(2018, 1, 1))
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2022, 1, 1))
    assert_equal 'Pasteur APE', @user.level

    @user.gratitudes.create!(level: 'Ministère P1', start_at: Date.new(2022, 1, 1))
    assert_equal 'Ministère P1', @user.reload.level
  end

  test "niveaux de tous les utilisateurs en une requête, même règle que #level" do
    other = users(:other)
    @user.gratitudes.create!(level: 'Probatoire', start_at: Date.new(2018, 1, 1))
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2022, 1, 1))
    other.gratitudes.create!(level: 'Ancien', start_at: nil)

    levels = User.current_levels
    assert_equal 'Pasteur APE', levels[@user.id]
    assert_equal 'Ancien', levels[other.id]
    assert_not levels.key?(users(:admin).id)

    assert_equal({ @user.id => 'Pasteur APE' }, User.current_levels([@user.id]))
  end

  test "filtre par niveau courant" do
    @user.gratitudes.create!(level: 'Probatoire', start_at: Date.new(2018, 1, 1))
    @user.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2022, 1, 1))
    assert_equal [@user.id], User.with_current_level_in(['Pasteur APE']).pluck(:id)
    assert_equal [], User.with_current_level_in(['Probatoire']).pluck(:id)
  end

  test "un compte désactivé ne peut plus s'authentifier" do
    assert @user.active_for_authentication?
    @user.update_column(:disabled, true)
    assert_not @user.active_for_authentication?
    assert_includes User.disabled, @user
    assert_not_includes User.enabled, @user
  end

  test "les secrets ne sont jamais sérialisés" do
    user = users(:other)
    json = user.as_json(except: [:email])
    User::SECRET_ATTRIBUTES.each { |attribute| assert_not json.key?(attribute), attribute }
    assert_not json.key?('email')
    assert_not user.public_attributes.key?('access_token')
  end

  test "paramètres autorisés : mot de passe seulement s'il est fourni" do
    without = ActionController::Parameters.new(user: { firstname: 'A', password: '', disabled: true, fcm_token: 'x' })
    assert_equal({ 'firstname' => 'A', 'fcm_token' => 'x' }, User.allowed_params(without).to_h)

    with = ActionController::Parameters.new(user: { firstname: 'A', password: 'secret12', password_confirmation: 'secret12', id: 9 })
    assert_equal({ 'firstname' => 'A', 'password' => 'secret12', 'password_confirmation' => 'secret12' }, User.allowed_params(with).to_h)
  end

  test "campagnes où l'utilisateur a encore un bulletin" do
    campaign = Campaign.create!(name: 'AG', structure: @association)
    campaign.voting_tables.create!(position: User::NO_LEVEL, as_member: false, voting: 'count')
    Campaign.create!(name: 'Close', structure: @association, state: 'closed')
      .voting_tables.create!(position: User::NO_LEVEL, as_member: false, voting: 'count')

    assert_equal [campaign.id], @user.eligible_campaign_ids
  end
end
