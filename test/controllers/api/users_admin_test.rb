require "test_helper"

# Gestion des utilisateurs par un admin : liste par espace, invitation,
# fiche complète, parcours (reconnaissances, fonctions, cotisations), rôles.
class Api::UsersAdminTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @member = users(:simple)
    @other = users(:other)
    @headers = auth_headers(@admin)
    Role.find_or_create_by!(name: 'member')
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  test "la liste admin renvoie tous les utilisateurs avec leurs rôles et leur niveau" do
    get '/api/users', params: { domain: 'admin' }, headers: @headers
    assert_response :success
    admin_row = json['users'].find { |u| u['id'] == @admin.id }
    assert_includes admin_row['roles'].to_s, 'admin'
    assert_equal 'Non renseigné', admin_row['current_level']
    assert_equal User.count, json['users'].size
  end

  test "sans espace, la liste est vide" do
    get '/api/users', headers: @headers
    assert_response :success
    assert_equal [], json['users']
  end

  test "un responsable de région liste les membres de sa région" do
    region = Region.create!(name: 'Région')
    @member.add_role :president, region
    @other.add_role :member, region

    get '/api/users', params: { domain: 'region' }, headers: auth_headers(@member)
    assert_response :success
    assert_includes json['users'].map { |u| u['id'] }, @other.id
  end

  test "un responsable d'association liste les membres de son association" do
    association = structures(:association)
    @member.add_role :president, association
    @other.add_role :member, association

    get '/api/users', params: { domain: 'association' }, headers: auth_headers(@member)
    assert_response :success
    assert_includes json['users'].map { |u| u['id'] }, @other.id
  end

  test "la fiche renvoie le parcours, les reconnaissances et les rôles" do
    church = structures(:church)
    @other.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2020, 1, 1))
    @other.phases.create!(church_id: church.id, function: 'Pasteur', start_at: Date.new(2021, 1, 1))
    @other.responsabilities.create!(association_id: structures(:association).id, function: 'Président', start_at: Date.new(2022, 1, 1))

    get "/api/users/#{@other.id}", headers: @headers
    assert_response :success
    assert_equal 'Pasteur APE', json['user']['level']
    assert_equal 1, json['gratitudes'].size
    assert_match(/\AChurch One/, json['phases'].first['church_name'])
    assert_equal 'Business One', json['responsabilities'].first['name']
    assert_equal [], json['roles']
  end

  test "un admin invite un utilisateur avec son parcours et ses cotisations" do
    assert_emails 1 do
      post '/api/users', params: { user: {
        user: { email: 'nouveau@yopmail.com', firstname: 'jean', lastname: 'dupont' },
        gratitudes: { '0' => { level: 'Pasteur APE', start_at: '2020-01-01' } },
        phases: { '0' => { church_id: structures(:church).id, function: 'Pasteur', start_at: '2021-01-01' } },
        responsabilities: { '0' => { association_id: structures(:association).id, function: 'Trésorier', start_at: '2022-01-01' } },
        fees: { '0' => { what: '2025', amount: 50, paid_at: '2025-01-15' } }
      } }, headers: @headers
    end
    assert_response :success

    user = User.find_by!(email: 'nouveau@yopmail.com')
    assert_equal 'Pasteur APE', user.level
    assert_equal 1, user.phases.count
    assert_equal 1, user.responsabilities.count
    assert_equal ['2025'], user.fees.pluck(:what)
  end

  test "un admin met à jour le parcours : lignes modifiées, ajoutées et supprimées" do
    kept    = @other.gratitudes.create!(level: 'Probatoire', start_at: Date.new(2018, 1, 1))
    dropped = @other.gratitudes.create!(level: 'Pasteur stagiaire', start_at: Date.new(2019, 1, 1))
    fee     = @other.fees.create!(what: '2024', amount: 10, paid_at: Date.new(2024, 1, 1))

    patch "/api/users/#{@other.id}", params: { user: {
      user: { firstname: 'Other', town: 'Lille' },
      gratitudes: { '0' => { id: kept.id, level: 'Probatoire', start_at: '2018-02-01' },
                    '1' => { level: 'Pasteur APE', start_at: '2023-01-01' } },
      fees: { '0' => { id: fee.id, what: '2024', amount: 20 } }
    } }, headers: @headers
    assert_response :success

    assert_equal 'Lille', @other.reload.town
    assert_not Career.exists?(dropped.id)
    assert_equal Date.new(2018, 2, 1), kept.reload.start_at.to_date
    assert_equal 'Pasteur APE', @other.level
    assert_equal 20, fee.reload.amount.to_i
  end

  test "un admin désactive, réactive et réinvite un utilisateur" do
    patch "/api/users/#{@other.id}/disable", headers: @headers
    assert_response :success
    assert @other.reload.disabled

    patch "/api/users/#{@other.id}/enable", headers: @headers
    assert_response :success
    assert_not @other.reload.disabled

    assert_emails 1 do
      post "/api/users/#{@other.id}/send_invitation", headers: @headers
    end
    assert_response :success
  end

  test "un admin donne puis retire le rôle modérateur" do
    patch "/api/users/#{@other.id}/add_role", params: { role: 'moderator' }, headers: @headers
    assert_response :success
    assert @other.has_role?(:moderator)

    patch "/api/users/#{@other.id}/remove_role", params: { role: 'moderator' }, headers: @headers
    assert_response :success
    assert_not @other.reload.has_role?(:moderator)
  end

  test "un admin supprime un utilisateur" do
    delete "/api/users/#{@other.id}", headers: @headers
    assert_response :success
    assert_not User.exists?(@other.id)
  end

  test "un modérateur liste les utilisateurs mais ne donne pas de rôle" do
    @member.add_role :moderator
    headers = auth_headers(@member)

    get '/api/users', params: { domain: 'admin' }, headers: headers
    assert_response :success

    patch "/api/users/#{@other.id}/add_role", params: { role: 'admin' }, headers: headers
    assert_response :forbidden
  end
end
