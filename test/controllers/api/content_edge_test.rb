require "test_helper"

# Actus, événements, fichiers joints, documents, catégories : cas limites et
# droits (responsable de la structure, membre, autre structure).
class Api::ContentEdgeTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @headers = auth_headers(@admin)
    @member = users(:simple)
    @association = structures(:association)
    @category = Category.create!(name: 'AG', kind: 'event')
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def pdf
    fixture_file_upload('document.pdf', 'application/pdf')
  end

  def image
    fixture_file_upload('image.png', 'image/png')
  end

  def create_event(structure: @association, **attrs)
    Event.create!({ title: 'AG', structure: structure, category: @category,
                    start_at: 1.day.from_now, end_at: 2.days.from_now }.merge(attrs))
  end

  def attach(record, file = 'document.pdf', type = 'application/pdf')
    record.files.attach(io: File.open(file_fixture(file)), filename: file, content_type: type)
    record.files.last
  end

  # ---------- Événements ----------

  test "liste des événements par espace : responsable d'association, de région, sans responsabilité" do
    region = Region.create!(name: 'Région')
    in_association = create_event(title: 'Association')
    in_region = create_event(title: 'Région', structure: region)
    @member.add_role :president, @association
    other = users(:other)
    other.add_role :director, region

    get '/api/events', params: { domain: 'association' }, headers: auth_headers(@member)
    assert_equal [in_association.id], json['events'].map { |e| e['id'] }

    get '/api/events', params: { domain: 'region' }, headers: auth_headers(other)
    assert_equal [in_region.id], json['events'].map { |e| e['id'] }

    get '/api/events', params: { domain: 'region' }, headers: auth_headers(@member)
    assert_equal [], json['events']
    get '/api/events', params: { domain: 'association' }, headers: auth_headers(other)
    assert_equal [], json['events']
    get '/api/events', headers: auth_headers(other)
    assert_equal [], json['events'], "l'espace membre passe par /api/me/events"
    get '/api/events', params: { domain: 'admin' }, headers: auth_headers(other)
    assert_response :forbidden
  end

  test "un événement non destiné au membre n'est pas lisible" do
    event = create_event
    event.accesses.create!(level: 'Probatoire', can_access: true)
    @member.add_role :member, @association

    get "/api/events/#{event.id}", headers: auth_headers(@member)
    assert_response :forbidden

    event.accesses.create!(level: 'Non renseigné', can_access: true)
    get "/api/events/#{event.id}", headers: auth_headers(@member)
    assert_response :success
  end

  test "le responsable modifie son événement (fichiers ajoutés) mais ne le déplace pas hors de son périmètre" do
    @member.add_role :president, @association
    event = create_event
    headers = auth_headers(@member)

    patch "/api/events/#{event.id}", params: { event: { title: 'Déplacé', structure_id: Association.create!(name: 'Autre').id,
                                                        category: 'AG', accesses: { '0' => 'Probatoire' } } }, headers: headers
    assert_response :forbidden
    assert_equal @association.id, event.reload.structure_id

    patch "/api/events/#{event.id}", params: { event: { title: 'AG modifiée', category: 'AG', accesses: { '0' => 'Probatoire' } },
                                               files: [pdf, image] }, headers: headers
    assert_response :success
    assert_equal 2, event.reload.files.count

    get "/api/events/#{event.id}", headers: headers
    assert_equal 1, json['event']['attachments'].size
    assert_equal 1, json['event']['images'].size
  end

  test "un événement modifié sans titre est refusé" do
    event = create_event
    patch "/api/events/#{event.id}", params: { event: { title: '', category: 'AG', accesses: { '0' => 'Probatoire' } } }, headers: @headers
    assert_equal 422, json['status']
    assert_equal 'AG', event.reload.title
  end

  test "un membre ne modifie pas un événement" do
    event = create_event
    patch "/api/events/#{event.id}", params: { event: { title: 'Pirate', category: 'AG', accesses: {} } }, headers: auth_headers(@member)
    assert_response :forbidden
  end

  test "mes événements : recherche, images et pièces jointes" do
    @member.add_role :member, @association
    event = create_event(title: 'Synode national', description: 'Ordre du jour')
    create_event(title: 'Autre rencontre')
    Event.where(structure: @association).each { |e| e.accesses.create!(level: 'Non renseigné', can_access: true) }
    attach(event)
    attach(event, 'image.png', 'image/png')

    get '/api/me/events', params: { search: 'Synode' }, headers: auth_headers(@member)
    assert_response :success
    assert_equal [event.id], json['events'].map { |e| e['id'] }
    assert_equal 1, json['events'].first['images'].size
    assert_equal 1, json['events'].first['attachments'].size

    get '/api/me/events', params: { offset: 5 }, headers: auth_headers(@member)
    assert_equal [], json['events']
  end

  # ---------- Actus ----------

  test "liste des actus : espace association, région, ou membre sans espace" do
    region = Region.create!(name: 'Région')
    Post.create!(title: 'Association', content: 'x', structure: @association)
    Post.create!(title: 'Région', content: 'x', structure: region)
    @member.add_role :secretary, @association
    @member.add_role :treasurer, region

    get '/api/posts', params: { domain: 'association' }, headers: auth_headers(@member)
    assert_equal ['Association'], json['posts'].map { |p| p['title'] }
    get '/api/posts', params: { domain: 'region' }, headers: auth_headers(@member)
    assert_equal ['Région'], json['posts'].map { |p| p['title'] }
    get '/api/posts', headers: auth_headers(@member)
    assert_response :forbidden
    get '/api/posts', params: { domain: 'admin' }, headers: @headers
    assert_equal 2, json['posts'].size
  end

  test "une actu modifiée sans pièces jointes ni accès les retire tous" do
    record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    attach(record)
    record.accesses.create!(level: 'Probatoire', can_access: true)

    patch "/api/posts/#{record.id}", params: { post: { title: 'Vidée', accesses: { '0' => { value: '' } } } }, headers: @headers
    assert_response :success
    record.reload
    assert_equal 'Vidée', record.title
    assert_equal 0, record.files.count
    assert_equal 0, record.accesses.count
  end

  test "un responsable ne déplace pas une actu vers une structure hors de son périmètre" do
    @member.add_role :president, @association
    record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    patch "/api/posts/#{record.id}", params: { post: { structure_id: Association.create!(name: 'Autre').id } }, headers: auth_headers(@member)
    assert_response :forbidden
    assert_equal @association.id, record.reload.structure_id
  end

  test "actu inconnue : 404" do
    get '/api/posts/999999', headers: @headers
    assert_response :not_found
  end

  test "le fil affiche les pièces jointes non image" do
    @member.add_role :member, @association
    record = Post.create!(title: 'Avec PDF', content: 'x', structure: @association, published_at: 1.hour.ago)
    record.accesses.create!(level: 'Non renseigné', can_access: true)
    attach(record)

    get '/api/feed', headers: auth_headers(@member)
    assert_equal 1, json['posts'].first['attachments'].size
    assert_equal [], json['posts'].first['images']
  end

  # ---------- Fichiers joints ----------

  test "le responsable supprime une pièce jointe de son actu ou de son événement, pas d'ailleurs" do
    @member.add_role :president, @association
    headers = auth_headers(@member)
    own_post_file = attach(Post.create!(title: 'A', content: 'x', structure: @association))
    own_event_file = attach(create_event)
    foreign_file = attach(Post.create!(title: 'B', content: 'x', structure: Association.create!(name: 'Autre')))
    @member.avatar.attach(io: File.open(file_fixture('image.png')), filename: 'avatar.png', content_type: 'image/png')
    avatar = @member.avatar_attachment

    delete "/api/files/#{own_post_file.id}", headers: headers
    assert_response :success
    delete "/api/files/#{own_event_file.id}", headers: headers
    assert_response :success
    delete "/api/files/#{foreign_file.id}", headers: headers
    assert_response :forbidden
    delete "/api/files/#{avatar.id}", headers: headers
    assert_response :forbidden, "seules les pièces jointes d'actus et d'événements se suppriment ici"

    assert_not ActiveStorage::Attachment.exists?(own_post_file.id)
    assert_not ActiveStorage::Attachment.exists?(own_event_file.id)
    assert ActiveStorage::Attachment.exists?(foreign_file.id)

    delete "/api/files/#{foreign_file.id}", headers: @headers
    assert_response :success
    delete '/api/files/999999', headers: @headers
    assert_response :not_found
  end

  # ---------- Documents et catégories ----------

  test "documents : arbre sans document non classé, sous-dossiers et liens" do
    Document.where(category_id: nil).delete_all
    parent = Category.create!(name: 'Statuts', kind: 'document', order: 1)
    child = Category.create!(name: 'Anciens', kind: 'document', order: 1, category: parent)
    link = Document.create!(name: 'Site', url: 'https://exemple.org', category: child)
    file = Document.new(name: 'Règlement', category: parent)
    file.file.attach(io: File.open(file_fixture('document.pdf')), filename: 'reglement.pdf', content_type: 'application/pdf')
    file.save!

    get '/api/documents', headers: auth_headers(@member)
    assert_response :success
    assert_equal ['Statuts'], json.map { |c| c['name'] }, "pas de dossier « Non répertoriés »"
    statuts = json.first
    assert_equal 'document', statuts['documents'].first['type']
    assert_match '/rails/active_storage/blobs/', statuts['documents'].first['href']
    sub = statuts['categories'].first
    assert_equal 'Anciens', sub['name']
    assert_equal [{ 'type' => 'url', 'href' => 'https://exemple.org' }], sub['documents'].map { |d| d.slice('type', 'href') }
    assert_equal link.id, sub['documents'].first['id']
  end

  test "documents : rangement imbriqué, élément inconnu ignoré, retour à la racine" do
    parent = Category.create!(name: 'Parent', kind: 'document')
    child = Category.create!(name: 'Enfant', kind: 'document')
    doc = Document.create!(name: 'Lien', url: 'https://exemple.org')

    post '/api/update_order_documents', params: { items: [
      { id: parent.id, type: 'category', categories: [
        { id: child.id, type: 'category', documents: [{ id: doc.id, type: 'url' }] }
      ] },
      { id: -1, type: 'category', documents: [] },
      { id: 42, type: 'folder' }
    ] }, headers: @headers, as: :json
    assert_response :success
    assert_nil parent.reload.category_id
    assert_equal parent.id, child.reload.category_id
    assert_equal child.id, doc.reload.category_id

    post '/api/update_order_documents', params: { items: [{ id: doc.id, type: 'url' }] }, headers: @headers, as: :json
    assert_nil doc.reload.category_id
  end

  test "documents : modification, nom vide refusé, fichier et lien à la fois refusés, suppression" do
    doc = Document.create!(name: 'Lien', url: 'https://exemple.org')

    patch "/api/documents/#{doc.id}", params: { name: 'Nouveau nom', description: 'Desc' }, headers: @headers
    assert_response :success
    assert_equal 'Nouveau nom', doc.reload.name

    patch "/api/documents/#{doc.id}", params: { name: '' }, headers: @headers
    assert_response :unprocessable_entity
    assert_match 'Name', json['error']

    both = Document.new(name: 'Les deux', url: 'https://exemple.org')
    both.file.attach(io: File.open(file_fixture('document.pdf')), filename: 'x.pdf', content_type: 'application/pdf')
    assert_not both.valid?
    assert both.errors[:file].any?

    delete "/api/documents/#{doc.id}", headers: @headers
    assert_response :success
    assert_not Document.exists?(doc.id)
  end

  test "documents : le nom d'un fichier déposé est nettoyé" do
    upload = Rack::Test::UploadedFile.new(file_fixture('document.pdf'), 'application/pdf', original_filename: ' Procès-verbal  AG 2025 !.pdf')
    post '/api/documents', params: { files: [upload] }, headers: @headers
    assert_response :success
    assert Document.exists?(name: 'proces-verbal_ag_2025')
  end

  test "catégories : nom vide refusé à la création et à la modification, suppression" do
    post '/api/categories', params: { category: { name: '' } }, headers: @headers
    assert_response :unprocessable_entity
    assert json['name'].any?

    category = Category.create!(name: 'Dossier', kind: 'document')
    patch "/api/categories/#{category.id}", params: { category: { name: 'Renommé' } }, headers: @headers
    assert_response :success
    assert_equal 'Renommé', json['name']

    patch "/api/categories/#{category.id}", params: { category: { name: '' } }, headers: @headers
    assert_response :unprocessable_entity

    delete "/api/categories/#{category.id}", headers: @headers
    assert_response :success
    assert_not Category.exists?(category.id)
  end
end
