require "test_helper"

# Contrat de l'API avec l'app mobile « Pasteurs ADD » (versions publiées sur les stores) :
# chaque endpoint consommé par l'app, avec les clés JSON qu'elle lit.
# Un échec ici signifie qu'une version de l'app déjà installée risque de casser.
class Api::MobileContractTest < ActionDispatch::IntegrationTest
  def setup
    @member = users(:simple)
    @headers = auth_headers(@member)
    @association = structures(:association)
    @member.add_role :member, @association
    @member.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2020, 1, 1))
    Role.find_or_create_by!(name: 'president')
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def publish_post(title, published_at: 1.day.ago, level: 'Pasteur APE', structure: @association, **attrs)
    Post.create!(title: title, content: '<p>Texte</p>', structure: structure, published_at: published_at, **attrs).tap do |p|
      p.accesses.create!(level: level, can_access: true)
    end
  end

  # ---------- Connexion ----------

  test "connexion mobile : POST /users/sign_in renvoie user et token" do
    post '/users/sign_in', params: { email: @member.email, password: '123greetings' }
    assert_response :created
    assert_equal @member.id, json['user']['id']
    assert ApiToken.where(active: true).exists?(token: json['token'])

    post '/users/sign_in', params: { email: @member.email, password: 'faux' }
    assert_response :unauthorized
  end

  test "connexion web : POST /api/login réutilise le jeton actif" do
    post '/api/login', params: { email: @member.email, password: '123greetings' }
    assert_response :created
    first_token = json['token']

    post '/api/login', params: { email: @member.email, password: '123greetings' }
    assert_equal first_token, json['token']

    post '/api/login', params: { email: 'inconnu@yopmail.com', password: 'x' }
    assert_response :unauthorized
  end

  test "sans jeton ou avec un jeton désactivé, l'API répond 401" do
    get '/api/current_user'
    assert_response :unauthorized

    token = @member.api_tokens.create!
    token.update!(active: false)
    get '/api/current_user', headers: { 'Authorization' => "Bearer #{token.token}" }
    assert_response :unauthorized
  end

  # ---------- Profil ----------

  test "current_user : user (avec level), roles, region" do
    get '/api/current_user', headers: @headers
    assert_response :success
    assert_equal @member.id, json['user']['id']
    assert_equal 'Pasteur APE', json['user']['level']
    assert_equal [], json['roles']
    assert json.key?('region')
    assert_nil json['original_user']
  end

  test "profile : profil, reconnaissances, cotisations, présidences, parcours" do
    church = structures(:church)
    @member.phases.create!(church_id: church.id, function: 'Pasteur', start_at: Date.new(2021, 1, 1))
    @member.fees.create!(what: '2025', amount: 50, paid_at: Date.new(2025, 1, 1))
    @member.add_role :president, church

    get '/api/profile', headers: @headers
    assert_response :success
    assert_equal @member.id, json['profile']['id']
    assert_equal ['Pasteur APE'], json['gratitudes'].map { |g| g['level'] }
    assert_equal ['2025'], json['fees'].map { |f| f['what'] }
    assert_equal [church.id], json['presidences'].map { |p| p['id'] }
    assert_equal 'Church', json['presidences'].first['mtype']
    assert_equal 1, json['phases'].size
    assert_equal [], json['responsabilities']
  end

  test "mise à jour de son profil depuis l'app" do
    patch "/api/users/#{@member.id}", params: { user: { user: { phone_1: '0600000000' } } }, headers: @headers
    assert_response :success
    assert_equal '0600000000', @member.reload.phone_1
  end

  # ---------- Fil et événements ----------

  test "feed : actus récentes, destinées au niveau du membre, épinglées d'abord" do
    pinned   = publish_post('Épinglée', published_at: 10.days.ago, pinned: true)
    recent   = publish_post('Récente')
    publish_post('Trop ancienne', published_at: 4.months.ago)
    publish_post('Expirée', expired_at: 1.hour.ago)
    publish_post('Autre niveau', level: 'Probatoire')
    publish_post('Autre structure', structure: Association.create!(name: 'Ailleurs'))
    recent.files.attach(io: File.open(file_fixture('image.png')), filename: 'photo.png', content_type: 'image/png')

    get '/api/feed', headers: @headers
    assert_response :success
    assert_equal [pinned.id, recent.id], json['posts'].map { |p| p['id'] }
    first = json['posts'].last
    assert_equal 1, first['images'].size
    assert_equal [], first['attachments']
    assert_equal 'Business One', first['structure']['name']

    get '/api/feed', params: { search: 'Récente' }, headers: @headers
    assert_equal [recent.id], json['posts'].map { |p| p['id'] }

    get '/api/feed', params: { offset: 10 }, headers: @headers
    assert_equal [], json['posts']
  end

  test "posts/:id : une actu du fil est lisible" do
    record = publish_post('Lisible')
    get "/api/posts/#{record.id}", headers: @headers
    assert_response :success
    assert_equal 'Lisible', json['post']['title']
    assert json['post'].key?('images')
  end

  test "me/events et events/:id : événements à venir destinés au membre" do
    category = Category.create!(name: 'AG', kind: 'event')
    upcoming = Event.create!(title: 'AG', structure: @association, category: category,
                             start_at: 1.day.from_now, end_at: 2.days.from_now)
    upcoming.accesses.create!(level: 'Pasteur APE', can_access: true)
    past = Event.create!(title: 'Passé', structure: @association, category: category,
                         start_at: 3.days.ago, end_at: 2.days.ago)
    past.accesses.create!(level: 'Pasteur APE', can_access: true)

    get '/api/me/events', headers: @headers
    assert_response :success
    assert_equal [upcoming.id], json['events'].map { |e| e['id'] }
    assert_equal 'Business One', json['events'].first['structure']['name']
    assert json['events'].first.key?('images')

    get "/api/events/#{upcoming.id}", headers: @headers
    assert_response :success
    assert_equal 'AG', json['event']['title']
    assert_equal ['Pasteur APE'], json['accesses']
  end

  # ---------- Annuaire ----------

  test "search : membres actifs, églises et associations triés par nom" do
    users(:other).update!(lastname: 'Zébulon', disabled: false)
    users(:admin).update!(lastname: 'Zébulon inactif', disabled: true)
    Church.create!(name: 'Zébulon Église', town: 'Lyon')
    Association.create!(name: 'Zébulon Œuvre')

    get '/api/search', params: { query: 'Zébulon' }, headers: @headers
    assert_response :success
    assert_equal %w[users churches associations], json.map { |r| r['model_type'] }
    user_row = json.first
    assert_equal users(:other).id, user_row['id']
    assert_match %r{/avatars/#{users(:other).id}\.png\z}, user_row['photo_url']
    %w[id name phone email zipcode town photo_url model_type mdi icon].each { |key| assert user_row.key?(key), key }
    assert user_row.key?('level')
  end

  test "annuaire : fiches utilisateur, église et association" do
    get "/api/users/#{users(:other).id}", headers: @headers
    assert_response :success
    assert_equal [], json['fees']
    get "/api/churches/#{structures(:church).id}", headers: @headers
    assert_response :success
    assert json.key?('members')
    get "/api/associations/#{@association.id}", headers: @headers
    assert_response :success
    assert_includes json['members'].map { |m| m['member_id'] || m['id'] }, @member.id
  end

  test "avatars et logos : redirection vers l'image ou un visuel par défaut" do
    get "/avatars/#{@member.id}.png"
    assert_response :redirect
    assert_match 'dummyimage.com', @response.location
    assert_match 'text=SU', @response.location

    @member.avatar.attach(io: File.open(file_fixture('image.png')), filename: 'a.png', content_type: 'image/png')
    get "/avatars/#{@member.id}.png"
    assert_response :redirect
    assert_match '/rails/active_storage/', @response.location

    get "/logos/#{@association.id}.png"
    assert_response :redirect
  end

  # ---------- Documents, votes, notifications ----------

  test "documents : arbre des dossiers" do
    get '/api/documents', headers: @headers
    assert_response :success
    assert_kind_of Array, json
  end

  test "votes : campagnes ouvertes au membre" do
    campaign = @association.campaigns.create!(name: 'AG', state: 'opened')
    campaign.voting_tables.create!(position: 'Pasteur APE', voting: 'count', as_member: true)

    get '/api/votes', headers: @headers
    assert_response :success
    assert_includes @response.body, 'AG'

    get "/api/votes/#{campaign.id}", headers: @headers
    assert_response :success
    assert_equal 1, json['voters'].size
  end

  test "notifications : liste, lecture d'une notification puis de toutes" do
    record = publish_post('Notifiée')
    first  = Notification.create!(recipient: @member, sender: @association, notifiable: record, action: 'created')
    second = Notification.create!(recipient: @member, sender: @association, notifiable: record, action: 'created')
    Notification.create!(recipient: users(:other), sender: @association, notifiable: record, action: 'created')

    get '/api/notifications', headers: @headers
    assert_response :success
    assert_equal 2, json['notifications'].size
    assert_equal 'Notifiée', json['notifications'].first['notifiable']['title']
    assert json['notifications'].first.key?('sender')

    patch "/api/notifications/#{first.id}/mark_as_read", headers: @headers
    assert_response :success
    assert first.reload.read
    assert_not second.reload.read

    patch '/api/notifications/mark_all_as_read', headers: @headers
    assert second.reload.read
  end

  test "notifications : on ne lit pas celles d'un autre" do
    other = Notification.create!(recipient: users(:other), sender: @association,
                                 notifiable: publish_post('X'), action: 'created')
    patch "/api/notifications/#{other.id}/mark_as_read", headers: @headers
    assert_response :not_found
    assert_not other.reload.read
  end

  # ---------- SSO Archivate ----------

  test "sso archivate : jeton généré par le membre, validé une seule fois par Archivate" do
    post '/api/archivate/sso/generate', headers: @headers
    assert_response :created
    token = json['token']
    assert_match "token=#{token}", json['redirect_url']

    post '/api/archivate/sso/validate', params: { token: token }
    assert_response :success
    assert_equal @member.email, json['user']['email']

    post '/api/archivate/sso/validate', params: { token: token }
    assert_response :unauthorized
  end
end
