require "test_helper"

# Actus, événements, documents et catégories : parcours d'un admin
# (création avec pièces jointes et niveaux d'accès, modification, suppression).
class Api::ContentTest < ActionDispatch::IntegrationTest
  def setup
    @admin = users(:admin)
    @admin.add_role :admin
    @headers = auth_headers(@admin)
    @association = structures(:association)
    https!
  end

  def json
    JSON.parse(@response.body)
  end

  def image
    fixture_file_upload('image.png', 'image/png')
  end

  def pdf
    fixture_file_upload('document.pdf', 'application/pdf')
  end

  # ---------- Actus ----------

  test "un admin publie une actu avec image, pièce jointe et niveaux d'accès" do
    post '/api/posts', params: { post: {
      title: 'Congrès', content: '<p>Texte <script>alert(1)</script></p>', structure_id: @association.id,
      published_at: Time.current, pinned: true,
      new_attachments: { '0' => image, '1' => pdf },
      accesses: { '0' => { value: 'Pasteur APE' }, '1' => { value: '' } }
    } }, headers: @headers
    assert_response :success
    assert_equal 200, json['status']

    record = Post.find(json['post']['id'])
    assert_equal 2, record.files.count
    assert_equal ['Pasteur APE'], record.accesses.pluck(:level)
    assert_not_includes record.content, '<script>'

    get "/api/posts/#{record.id}", headers: @headers
    assert_response :success
    assert_equal 1, json['post']['images'].size
    assert_equal 2, json['post']['existing_attachments'].size
    assert_equal [{ 'title' => 'Pasteur APE', 'value' => 'Pasteur APE' }], json['post']['accesses']
    assert_equal 'Business One', json['post']['structure']['name']
  end

  test "un admin modifie une actu : fichiers conservés ou retirés, accès remplacés" do
    record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    record.files.attach(io: File.open(file_fixture('image.png')), filename: 'gardee.png', content_type: 'image/png')
    record.files.attach(io: File.open(file_fixture('document.pdf')), filename: 'retiree.pdf', content_type: 'application/pdf')
    record.accesses.create!(level: 'Probatoire', can_access: true)
    kept = record.files.find { |f| f.filename.to_s == 'gardee.png' }

    patch "/api/posts/#{record.id}", params: { post: {
      title: 'Actu modifiée',
      existing_attachments: { '0' => { id: kept.id } },
      new_attachments: { '0' => pdf },
      accesses: { '0' => { value: 'Pasteur APE' } }
    } }, headers: @headers
    assert_response :success

    record.reload
    assert_equal 'Actu modifiée', record.title
    assert_equal %w[document.pdf gardee.png], record.files.map { |f| f.filename.to_s }.sort
    assert_equal ['Pasteur APE'], record.accesses.pluck(:level)
  end

  test "la liste admin des actus se filtre par recherche" do
    Post.create!(title: 'Assemblée générale', content: 'x', structure: @association)
    Post.create!(title: 'Autre', content: 'y', structure: @association)

    get '/api/posts', params: { search: 'Assemblée' }, headers: @headers
    assert_response :success
    assert_equal ['Assemblée générale'], json['posts'].map { |p| p['title'] }
    assert json['posts'].first.key?('structure')
  end

  test "un responsable liste les actus de ses structures" do
    member = users(:simple)
    member.add_role :president, @association
    mine = Post.create!(title: 'Mienne', content: 'x', structure: @association)
    Post.create!(title: 'Ailleurs', content: 'x', structure: Association.create!(name: 'Autre'))

    get '/api/posts', params: { domain: 'association' }, headers: auth_headers(member)
    assert_response :success
    assert_equal [mine.id], json['posts'].map { |p| p['id'] }
  end

  test "un admin supprime une actu et une pièce jointe" do
    record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    record.files.attach(io: File.open(file_fixture('document.pdf')), filename: 'doc.pdf', content_type: 'application/pdf')

    delete "/api/files/#{record.files.first.id}", headers: @headers
    assert_response :success
    assert_equal 0, record.reload.files.count

    delete "/api/posts/#{record.id}", headers: @headers
    assert_response :success
    assert_not Post.exists?(record.id)
  end

  # ---------- Événements ----------

  test "un admin crée un événement avec catégorie, fichiers et niveaux d'accès" do
    post '/api/events', params: { event: {
      title: 'Synode', description: '<p>Ordre du jour</p>', structure_id: @association.id, category: 'Synode',
      start_at: 2.days.from_now, end_at: 3.days.from_now, accesses: { '0' => 'Pasteur APE', '1' => 'Probatoire' }
    }, files: [image] }, headers: @headers
    assert_response :success
    assert_equal 200, json['status']
    assert_equal 'Synode', json['event']['category']['name']

    event = Event.find(json['event']['id'])
    assert_equal 'event', event.category.kind
    assert_equal %w[Pasteur\ APE Probatoire], event.accesses.pluck(:level).sort
    assert_equal 1, event.files.count

    get "/api/events/#{event.id}", headers: @headers
    assert_response :success
    assert_equal 1, json['event']['images'].size
    assert_equal 1, json['files'].size
    assert_equal %w[Pasteur\ APE Probatoire], json['accesses'].sort
  end

  test "un admin modifie un événement et remplace ses accès" do
    category = Category.create!(name: 'AG', kind: 'event')
    event = Event.create!(title: 'AG', structure: @association, category: category,
                          start_at: 1.day.from_now, end_at: 2.days.from_now)
    event.accesses.create!(level: 'Probatoire', can_access: true)

    patch "/api/events/#{event.id}", params: { event: {
      title: 'AG 2026', category: 'Assemblée', accesses: { '0' => 'Pasteur APE' }
    } }, headers: @headers
    assert_response :success

    event.reload
    assert_equal 'AG 2026', event.title
    assert_equal 'Assemblée', event.category.name
    assert_equal ['Pasteur APE'], event.accesses.pluck(:level)
  end

  test "un événement sans dates est refusé" do
    post '/api/events', params: { event: {
      title: 'Incomplet', structure_id: @association.id, category: 'AG', accesses: { '0' => 'Probatoire' }
    } }, headers: @headers
    assert_equal 422, json['status']
    assert json['errors'].key?('start_at')
  end

  test "la liste admin ne renvoie que les événements à venir" do
    category = Category.create!(name: 'AG', kind: 'event')
    upcoming = Event.create!(title: 'À venir', structure: @association, category: category,
                             start_at: 1.day.from_now, end_at: 2.days.from_now)
    Event.create!(title: 'Passé', structure: @association, category: category,
                  start_at: 3.days.ago, end_at: 2.days.ago)

    get '/api/events', params: { domain: 'admin' }, headers: @headers
    assert_response :success
    assert_equal [upcoming.id], json['events'].map { |e| e['id'] }
    assert_equal 'AG', json['events'].first['category']['name']

    delete "/api/events/#{upcoming.id}", headers: @headers
    assert_response :success
    assert_not Event.exists?(upcoming.id)
  end

  # ---------- Documents et catégories ----------

  test "un admin dépose des fichiers, ajoute un lien, les range puis les supprime" do
    post '/api/documents', params: { files: [fixture_file_upload('document.pdf', 'application/pdf')] }, headers: @headers
    assert_response :success
    uploaded = Document.find_by!(name: 'document')
    assert uploaded.file.attached?

    post '/api/documents', params: { url: 'https://exemple.org', name: 'Site', description: 'Lien' }, headers: @headers
    assert_response :success
    link = Document.find_by!(name: 'Site')

    post '/api/documents', headers: @headers
    assert_response :unprocessable_entity

    post '/api/categories', params: { category: { name: 'Statuts' } }, headers: @headers
    assert_response :created
    category = Category.find(json['id'])
    assert_equal 'document', category.kind

    post '/api/update_order_documents', params: { items: [
      { id: category.id, type: 'category', documents: [{ id: link.id, type: 'url' }] },
      { id: uploaded.id, type: 'document' }
    ] }, headers: @headers, as: :json
    assert_response :success
    assert_equal category.id, link.reload.category_id
    assert_equal 2, uploaded.reload.order

    get '/api/documents', headers: @headers
    assert_response :success
    folder = json.find { |f| f['id'] == category.id }
    assert_equal ['https://exemple.org'], folder['documents'].map { |d| d['href'] }
    unfiled = json.find { |f| f['id'] == -1 }
    assert_includes unfiled['documents'].map { |d| d['name'] }, 'document'

    patch "/api/documents/#{link.id}", params: { name: 'Site officiel' }, headers: @headers
    assert_response :success
    assert_equal 'Site officiel', link.reload.name

    patch "/api/categories/#{category.id}", params: { category: { name: 'Textes' } }, headers: @headers
    assert_response :success
    assert_equal 'Textes', category.reload.name

    delete "/api/categories/#{category.id}", headers: @headers
    assert_response :success
    assert_nil link.reload.category_id

    delete "/api/documents/#{link.id}", headers: @headers
    assert_response :success
    assert_not Document.exists?(link.id)
  end
end
