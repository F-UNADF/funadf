require "test_helper"

# Adhésions (PATCH/DELETE /api/memberships/:id, toggleCanVote) : rôle, droit de vote,
# retrait d'un membre. Admin ou responsable de la structure ; les rôles
# applicatifs (adhésions sans structure) restent réservés aux admins.
class Api::MembershipsTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @headers = auth_headers(@admin)
    @member = users(:simple)
    @other = users(:other)
    @association = structures(:association)
    @member_role = Role.find_or_create_by!(name: 'member')
    @secretary = Role.find_or_create_by!(name: 'secretary')
    @membership = @other.memberships.create!(structure: @association, role: @member_role, can_vote: true)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  test "un admin change le rôle d'une adhésion" do
    patch "/api/memberships/#{@membership.id}", params: { membership: { role_id: @secretary.id } }, headers: @headers
    assert_response :success
    assert_equal @secretary.id, json['membership']['role_id']
    assert_equal 'secretary', @membership.reload.role_name
  end

  test "un rôle inconnu ou applicatif est refusé" do
    admin_role = Role.find_by!(name: 'admin')
    [0, admin_role.id].each do |role_id|
      patch "/api/memberships/#{@membership.id}", params: { membership: { role_id: role_id } }, headers: @headers
      assert_response :unprocessable_entity
      assert_equal 'Invalid role', json['error']
    end
    assert_equal @member_role.id, @membership.reload.role_id
  end

  test "le droit de vote se modifie sans toucher au rôle" do
    patch "/api/memberships/#{@membership.id}", params: { membership: { can_vote: false } }, headers: @headers
    assert_response :success
    assert_equal false, @membership.reload.can_vote
    assert_equal @member_role.id, @membership.role_id

    post "/api/memberships/#{@membership.id}/toggleCanVote", headers: @headers
    assert_equal true, json['membership']['can_vote']
  end

  test "retirer un membre renvoie la liste à jour de la structure" do
    @member.memberships.create!(structure: @association, role: @member_role)

    delete "/api/memberships/#{@membership.id}", headers: @headers
    assert_response :success
    assert_not Membership.exists?(@membership.id)
    assert_equal [@member.id], json['members'].map { |m| m['member_id'] }
  end

  test "le responsable de la structure gère ses adhésions, pas un simple membre" do
    @member.add_role :president, @association
    patch "/api/memberships/#{@membership.id}", params: { membership: { role_id: @secretary.id } }, headers: auth_headers(@member)
    assert_response :success

    outsider = User.create!(email: 'dehors@yopmail.com', firstname: 'a', lastname: 'b', password: 'motdepasse1')
    headers = auth_headers(outsider)
    patch "/api/memberships/#{@membership.id}", params: { membership: { role_id: @member_role.id } }, headers: headers
    assert_response :forbidden
    post "/api/memberships/#{@membership.id}/toggleCanVote", headers: headers
    assert_response :forbidden
    delete "/api/memberships/#{@membership.id}", headers: headers
    assert_response :forbidden
    assert Membership.exists?(@membership.id)
  end

  test "une adhésion applicative (rôle admin) : réservée aux admins" do
    @other.add_role :moderator
    app_membership = @other.memberships.find_by(structure_id: nil)

    @member.add_role :president, @association
    post "/api/memberships/#{app_membership.id}/toggleCanVote", headers: auth_headers(@member)
    assert_response :forbidden

    post "/api/memberships/#{app_membership.id}/toggleCanVote", headers: @headers
    assert_response :success
  end

  test "adhésion inconnue : 404" do
    patch '/api/memberships/999999', params: { membership: { can_vote: false } }, headers: @headers
    assert_response :not_found
  end
end
