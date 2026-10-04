require "test_helper"
require "minitest/mock"

# Paramétrage et écrans génériques : rôles, cotisations, notifications push,
# référentiels des formulaires, configuration des écrans CRUD, menus.
class Api::SettingsTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @member = users(:simple)
    @headers = auth_headers(@admin)
    Role.find_or_create_by!(name: 'president')
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  # ---------- Rôles ----------

  test "un admin gère les rôles, un membre les consulte" do
    post '/api/roles', params: { role: { name: 'tresorier_adjoint', friendly_name: 'Trésorier adjoint' } }, headers: @headers
    assert_response :success
    role = Role.find(json['role']['id'])

    post '/api/roles', params: { role: { name: 'tresorier_adjoint' } }, headers: @headers
    assert_response :unprocessable_entity

    patch "/api/roles/#{role.id}", params: { role: { friendly_name: 'Trésorier adjoint(e)' } }, headers: @headers
    assert_response :success
    assert_equal 'Trésorier adjoint(e)', role.reload.friendly_name

    get '/api/roles', headers: auth_headers(@member)
    assert_response :success
    assert_includes json['roles'].map { |r| r['name'] }, 'tresorier_adjoint'
    get "/api/roles/#{role.id}", headers: auth_headers(@member)
    assert_response :success

    delete "/api/roles/#{role.id}", headers: @headers
    assert_response :success
    assert_not Role.exists?(role.id)
  end

  # ---------- Cotisations ----------

  test "un admin saisit, cherche, modifie et supprime une cotisation" do
    post '/api/fees', params: { fee: { what: '2026', amount: 80, paid_at: '2026-01-10', member: "User-#{@member.id}" } },
      headers: @headers
    assert_response :success
    fee = Fee.find(json['fee']['id'])
    assert_equal @member, fee.member

    post '/api/fees', params: { fee: { what: '', amount: 1 } }, headers: @headers
    assert_equal 422, json['status']

    get '/api/fees', params: { search: '2026' }, headers: @headers
    assert_equal [fee.id], json['fees'].map { |f| f['id'] }
    assert_equal @member.id, json['fees'].first['member']['id']

    get "/api/fees/#{fee.id}", headers: @headers
    assert_equal "User-#{@member.id}", json['fee']['member']

    patch "/api/fees/#{fee.id}", params: { fee: { amount: 90 } }, headers: @headers
    assert_equal 90, fee.reload.amount.to_i

    delete "/api/fees/#{fee.id}", headers: @headers
    assert_not Fee.exists?(fee.id)
  end

  # ---------- Notifications push ----------

  test "un admin rédige puis envoie une notification push à tous les appareils" do
    post '/api/push_notifications', params: { push_notification: { title: 'Congrès', body: 'Inscriptions ouvertes', url: '/feed' } },
      headers: @headers
    assert_response :created
    notification = PushNotification.find(json['id'])

    post '/api/push_notifications', params: { push_notification: { title: '' } }, headers: @headers
    assert_response(PushNotification.validators.any? ? :unprocessable_entity : :created)

    patch "/api/push_notifications/#{notification.id}", params: { push_notification: { body: 'Dernier jour' } }, headers: @headers
    assert_response :success
    assert_equal 'Dernier jour', notification.reload.body

    DeviceToken.delete_all
    DeviceToken.create!(user: @member, token: 'jeton-a', platform: 'mobile')
    DeviceToken.create!(user: @admin, token: 'jeton-b', platform: 'web')
    sent = []
    fake_service = Object.new
    fake_service.define_singleton_method(:send_notification) { |**args| sent << args; { success: true } }

    FcmNotificationService.stub(:new, fake_service) do
      post '/api/push_notifications/send', params: { id: notification.id }, headers: @headers
    end
    assert_response :success
    assert_equal 2, json['count']
    assert_equal %w[jeton-a jeton-b], sent.map { |s| s[:token] }.sort
    assert_equal ['Congrès'], sent.map { |s| s[:title] }.uniq
    assert notification.reload.sent_at

    get '/api/push_notifications', headers: @headers
    assert_response :success
    assert_includes json.map { |n| n['id'] }, notification.id

    delete "/api/push_notifications/#{notification.id}", headers: @headers
    assert_response :no_content
  end

  # ---------- Référentiels des formulaires ----------

  test "référentiels d'administration" do
    get '/api/referentiels/users', headers: @headers
    assert_response :success
    %w[levels whatFees churches functions responsabilities associations roles].each { |k| assert json.key?(k), k }

    %w[churches regions associations].each do |name|
      get "/api/referentiels/#{name}", headers: @headers
      assert_response :success
      assert_not_includes json['roles'].map { |r| r['name'] }, 'admin'
      assert_includes json['members'].map { |m| m['member_type'] }, 'User'
    end

    get '/api/referentiels/fees', headers: @headers
    assert json.key?('users') && json.key?('structures')
  end

  test "référentiels des formulaires de contenu, bornés par espace" do
    association = structures(:association)
    @member.add_role :president, association
    member_headers = auth_headers(@member)

    get '/api/referentiels/campaigns', headers: @headers
    assert_includes json['positions'], 'Eglises'
    assert_includes json['structures'].map { |s| s['name'] }, 'Business One'

    get '/api/referentiels/campaigns', params: { domain: 'association' }, headers: member_headers
    assert_equal [association.id], json['structures'].map { |s| s['id'] }

    get '/api/referentiels/events', params: { domain: 'region' }, headers: member_headers
    assert_equal [], json['structures']
    assert json.key?('categories') && json.key?('levels')

    get '/api/referentiels/posts', params: { domain: 'association' }, headers: member_headers
    assert_equal [association.id], json['structures'].map { |s| s['id'] }

    get '/api/referentiels/inconnu', headers: @headers
    assert_equal 'Invalid referentiel inconnu', json['error']
  end

  # ---------- Écrans CRUD génériques ----------

  test "configuration des écrans génériques" do
    %w[regions posts associations churches fees].each do |model|
      get "/api/#{model}/config", headers: @headers
      assert_response :success
      assert json['config'].present?, model
    end
  end

  # ---------- Menus ----------

  test "menu admin complet pour un admin, réduit pour un modérateur" do
    get '/api/menus/admin', headers: @headers
    titles = json.map { |i| i['title'] }.compact
    assert_includes titles, 'Cotisations'
    assert_includes titles, 'Roles'

    @member.add_role :moderator
    get '/api/menus/admin', headers: auth_headers(@member)
    titles = json.map { |i| i['title'] }.compact
    assert_includes titles, 'Utilisateurs'
    assert_not_includes titles, 'Cotisations'
  end

  test "menu de l'espace membre, avec l'accès aux espaces de gestion" do
    get '/api/menus/me', headers: auth_headers(@member)
    assert_equal ['Feed', 'Mon profil', 'Annuaire', 'Documents', 'Votes', 'Archivate'], json.map { |i| i['title'] }.compact

    @member.add_role :president, structures(:association)
    get '/api/menus/me', headers: auth_headers(@member)
    assert_includes json.map { |i| i['title'] }, 'Association'
  end

  test "menus association et région" do
    get '/api/menus/association', headers: @headers
    assert_includes json.map { |i| i['title'] }, 'Mes associations'
    get '/api/menus/region', headers: @headers
    assert_includes json.map { |i| i['title'] }, 'Membres'
  end
end
