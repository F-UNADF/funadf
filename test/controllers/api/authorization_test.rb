require "test_helper"
require "minitest/mock"

# Matrice d'autorisations de l'API.
# - membre simple : son profil, le fil, l'annuaire, les documents, les votes ;
# - responsable (président, secrétaire, trésorier, directeur) d'une association
#   ou d'une région : la gestion de SES structures (membres, campagnes, actus, événements) ;
# - modérateur : la liste des utilisateurs et l'usurpation d'un non-admin ;
# - admin : tout.
class AuthorizationTest < ActionDispatch::IntegrationTest
  def setup
    @member = users(:simple)
    @other  = users(:other)
    @admin  = users(:admin)
    @admin.add_role :admin

    @association = structures(:association)
    @church      = structures(:church)
    @region      = Region.create!(name: 'Région Test')
    @other_association = Association.create!(name: 'Autre association')

    @member_headers = auth_headers(@member)
    @admin_headers  = auth_headers(@admin)

    # Le cookie de session est `secure` : il faut du HTTPS pour qu'il soit renvoyé.
    https!
  end

  # ---------- Utilisateurs ----------

  test "un membre ne peut pas lister tous les utilisateurs (espace admin)" do
    get api_users_url(subdomain: nil), params: { domain: 'admin' }, headers: @member_headers
    assert_response :forbidden
  end

  test "un admin peut lister tous les utilisateurs" do
    get api_users_url(subdomain: nil), params: { domain: 'admin' }, headers: @admin_headers
    assert_response :success
  end

  test "un membre ne peut pas se donner le rôle admin" do
    patch "/api/users/#{@member.id}/add_role", params: { role: 'admin' }, headers: @member_headers
    assert_response :forbidden
    assert_not @member.reload.is_admin?
  end

  test "un membre ne peut pas modifier un autre utilisateur" do
    patch api_user_url(subdomain: nil, id: @other.id),
      params: { user: { user: { firstname: 'Pirate' } } }, headers: @member_headers
    assert_response :forbidden
    assert_equal 'Other', @other.reload.firstname
  end

  test "un membre peut modifier son propre profil (app mobile)" do
    patch api_user_url(subdomain: nil, id: @member.id),
      params: { user: { user: { firstname: 'nouveau', town: 'Lyon' } } }, headers: @member_headers
    assert_response :success
    assert_equal 'Nouveau', @member.reload.firstname
    assert_equal 'Lyon', @member.town
    assert_equal @member.id, JSON.parse(@response.body)['user']['id']
  end

  test "un membre ne peut pas modifier sa reconnaissance (niveau de vote) ni ses cotisations" do
    patch api_user_url(subdomain: nil, id: @member.id),
      params: { user: {
        user: { firstname: 'Simple', gratitudes_attributes: { '0' => { level: 'Pasteur APE', start_at: '2020-01-01' } },
                fees_attributes: { '0' => { what: '2025', amount: 1 } } },
        gratitudes: { '0' => { level: 'Pasteur APE', start_at: '2020-01-01' } },
        fees: { '0' => { what: '2024', amount: 1 } }
      } }, headers: @member_headers
    assert_response :success
    assert_equal 'Non renseigné', @member.reload.level
    assert_equal 0, @member.fees.count
  end

  test "un membre ne peut ni supprimer, ni désactiver, ni inviter un utilisateur" do
    delete api_user_url(subdomain: nil, id: @other.id), headers: @member_headers
    assert_response :forbidden
    patch "/api/users/#{@other.id}/disable", headers: @member_headers
    assert_response :forbidden
    post "/api/users/#{@other.id}/send_invitation", headers: @member_headers
    assert_response :forbidden
    post api_users_url(subdomain: nil),
      params: { user: { user: { email: 'nouveau@yopmail.com', firstname: 'a', lastname: 'b' } } }, headers: @member_headers
    assert_response :forbidden
    assert User.exists?(@other.id)
    assert_not @other.reload.disabled
  end

  test "la fiche annuaire d'un autre membre reste accessible (app mobile)" do
    get api_user_url(subdomain: nil, id: @other.id), headers: @member_headers
    assert_response :success
    get api_church_url(subdomain: nil, id: @church.id), headers: @member_headers
    assert_response :success
    get api_association_url(subdomain: nil, id: @association.id), headers: @member_headers
    assert_response :success
  end

  # ---------- Usurpation (connect_as) ----------

  test "un membre ne peut pas se connecter en tant qu'un autre utilisateur" do
    get api_switch_user_url(subdomain: nil, id: @admin.id), headers: @member_headers
    assert_response :forbidden

    get api_current_user_url(subdomain: nil), headers: @member_headers
    assert_equal @member.id, JSON.parse(@response.body)['user']['id']
  end

  test "un admin peut se connecter en tant qu'un membre puis revenir" do
    get api_switch_user_url(subdomain: nil, id: @other.id), headers: @admin_headers
    assert_response :success
    get api_current_user_url(subdomain: nil), headers: @admin_headers
    assert_equal @other.id, JSON.parse(@response.body)['user']['id']

    get api_switch_back_url(subdomain: nil), headers: @admin_headers
    get api_current_user_url(subdomain: nil), headers: @admin_headers
    assert_equal @admin.id, JSON.parse(@response.body)['user']['id']
  end

  test "un modérateur ne peut pas se connecter en tant qu'admin" do
    @other.add_role :moderator
    get api_switch_user_url(subdomain: nil, id: @admin.id), headers: auth_headers(@other)
    assert_response :forbidden
  end

  test "l'usurpation en session n'est pas reprise par un autre jeton" do
    get api_switch_user_url(subdomain: nil, id: @other.id), headers: @admin_headers
    assert_response :success

    # Même navigateur (même cookie de session), mais jeton d'un autre utilisateur.
    get api_current_user_url(subdomain: nil), headers: @member_headers
    assert_equal @member.id, JSON.parse(@response.body)['user']['id']
  end

  # ---------- Structures et adhésions ----------

  test "un membre ne peut ni créer, ni modifier, ni supprimer une structure" do
    post api_regions_url(subdomain: nil), params: { region: { name: 'Pirate' } }, headers: @member_headers
    assert_response :forbidden
    patch api_association_url(subdomain: nil, id: @association.id),
      params: { association: { name: 'Pirate' } }, headers: @member_headers
    assert_response :forbidden
    delete api_church_url(subdomain: nil, id: @church.id), headers: @member_headers
    assert_response :forbidden

    assert_not Region.exists?(name: 'Pirate')
    assert_equal 'Business One', @association.reload.name
    assert Church.exists?(@church.id)
  end

  test "un responsable d'association gère son association, pas celle des autres" do
    @member.add_role :president, @association

    patch api_association_url(subdomain: nil, id: @association.id),
      params: { association: { name: 'Nouveau nom' } }, headers: @member_headers
    assert_response :success
    assert_equal 'Nouveau nom', @association.reload.name

    patch api_association_url(subdomain: nil, id: @other_association.id),
      params: { association: { name: 'Pirate' } }, headers: @member_headers
    assert_response :forbidden
  end

  test "un membre ne peut pas modifier le droit de vote d'une adhésion" do
    membership = @association.memberships.create!(member: @other, role: Role.find_or_create_by(name: 'member'), can_vote: true)

    post "/api/memberships/#{membership.id}/toggleCanVote", headers: @member_headers
    assert_response :forbidden
    patch api_membership_url(subdomain: nil, id: membership.id),
      params: { membership: { can_vote: false } }, headers: @member_headers
    assert_response :forbidden
    delete api_membership_url(subdomain: nil, id: membership.id), headers: @member_headers
    assert_response :forbidden

    assert membership.reload.can_vote
  end

  test "un responsable de région gère les adhésions de sa région uniquement" do
    @member.add_role :secretary, @region
    mine   = @region.memberships.create!(member: @other, role: Role.find_or_create_by(name: 'member'), can_vote: true)
    theirs = @other_association.memberships.create!(member: @other, role: Role.find_or_create_by(name: 'member'), can_vote: true)

    post "/api/memberships/#{mine.id}/toggleCanVote", headers: @member_headers
    assert_response :success
    assert_not mine.reload.can_vote

    post "/api/memberships/#{theirs.id}/toggleCanVote", headers: @member_headers
    assert_response :forbidden
    assert theirs.reload.can_vote
  end

  test "un responsable ne peut pas attribuer le rôle admin via une structure" do
    @member.add_role :president, @association
    Role.find_or_create_by(name: 'treasurer')
    membership = @association.memberships.create!(member: @other, role: Role.find_or_create_by(name: 'member'))

    post "/api/associations/#{@association.id}/roles/edit",
      params: { member: { membership_id: membership.id }, role: 'admin' }, headers: @member_headers
    assert_response :unprocessable_entity
    assert_not @other.reload.is_admin?

    post "/api/associations/#{@association.id}/roles/edit",
      params: { member: { membership_id: membership.id }, role: 'treasurer' }, headers: @member_headers
    assert_response :success
    assert_equal 'treasurer', membership.reload.role_name
  end

  test "un responsable ne peut pas modifier une adhésion d'une autre structure via la sienne" do
    @member.add_role :president, @association
    theirs = @other_association.memberships.create!(member: @other, role: Role.find_or_create_by(name: 'member'))

    post "/api/associations/#{@association.id}/roles/edit",
      params: { member: { membership_id: theirs.id }, role: 'president' }, headers: @member_headers
    assert_response :not_found
    assert_equal 'member', theirs.reload.role_name
  end

  # ---------- Campagnes de vote ----------

  test "un membre ne peut ni créer, ni ouvrir, ni consulter les résultats d'une campagne" do
    campaign = @association.campaigns.create!(name: 'AG')

    post api_campaigns_url(subdomain: nil),
      params: { campaign: { name: 'Pirate', structure_id: @association.id, motions: [], voting_tables: [] } },
      headers: @member_headers, as: :json
    assert_response :forbidden
    patch "/api/campaigns/#{campaign.id}/change_state", params: { state_event: 'opening' }, headers: @member_headers
    assert_response :forbidden
    get api_campaign_url(subdomain: nil, id: campaign.id), headers: @member_headers
    assert_response :forbidden
    get api_campaigns_url(subdomain: nil), params: { domain: 'admin' }, headers: @member_headers
    assert_response :forbidden

    assert_equal 'coming', campaign.reload.state
    assert_not Campaign.exists?(name: 'Pirate')
  end

  test "un responsable gère les campagnes de sa structure, pas des autres" do
    @member.add_role :president, @association
    mine   = @association.campaigns.create!(name: 'AG')
    theirs = @other_association.campaigns.create!(name: 'AG autre')

    patch "/api/campaigns/#{mine.id}/change_state", params: { state_event: 'opening' }, headers: @member_headers
    assert_response :success
    assert_equal 'opened', mine.reload.state

    patch "/api/campaigns/#{theirs.id}/change_state", params: { state_event: 'opening' }, headers: @member_headers
    assert_response :forbidden

    post api_campaigns_url(subdomain: nil),
      params: { campaign: { name: 'Hors périmètre', structure_id: @other_association.id, motions: [], voting_tables: [] } },
      headers: @member_headers, as: :json
    assert_response :forbidden
  end

  # ---------- Actus, événements, fichiers ----------

  test "un membre ne peut ni publier, ni modifier, ni supprimer une actu" do
    post_record = Post.create!(title: 'Actu', content: 'Texte', structure: @association)

    post api_posts_url(subdomain: nil),
      params: { post: { title: 'Pirate', content: 'x', structure_id: @association.id } }, headers: @member_headers
    assert_response :forbidden
    patch api_post_url(subdomain: nil, id: post_record.id),
      params: { post: { title: 'Pirate' } }, headers: @member_headers
    assert_response :forbidden
    delete api_post_url(subdomain: nil, id: post_record.id), headers: @member_headers
    assert_response :forbidden
    get api_posts_url(subdomain: nil), params: { domain: 'admin' }, headers: @member_headers
    assert_response :forbidden

    assert_equal 'Actu', post_record.reload.title
    assert_not Post.exists?(title: 'Pirate')
  end

  test "un membre lit une actu qui lui est destinée (fil, notifications, app mobile)" do
    @member.add_role :member, @association
    @member.gratitudes.create!(level: 'Pasteur APE', start_at: Date.yesterday)
    post_record = Post.create!(title: 'Actu', content: 'Texte', structure: @association)
    post_record.accesses.create!(level: 'Pasteur APE', can_access: true)

    get api_post_url(subdomain: nil, id: post_record.id), headers: @member_headers
    assert_response :success
  end

  test "un membre ne lit pas une actu réservée à un autre niveau ou à une autre structure" do
    @member.add_role :member, @association
    @member.gratitudes.create!(level: 'Pasteur APE', start_at: Date.yesterday)
    reserved = Post.create!(title: 'Réservée', content: 'Texte', structure: @association)
    reserved.accesses.create!(level: 'Ministère P2', can_access: true)
    elsewhere = Post.create!(title: 'Ailleurs', content: 'Texte', structure: @other_association)
    elsewhere.accesses.create!(level: 'Pasteur APE', can_access: true)

    get api_post_url(subdomain: nil, id: reserved.id), headers: @member_headers
    assert_response :forbidden
    get api_post_url(subdomain: nil, id: elsewhere.id), headers: @member_headers
    assert_response :forbidden
  end

  test "un responsable de région publie pour sa région, pas pour une autre structure" do
    @member.add_role :president, @region

    post api_posts_url(subdomain: nil),
      params: { post: { title: 'Actu région', content: 'x', structure_id: @region.id } }, headers: @member_headers
    assert_response :success

    post api_posts_url(subdomain: nil),
      params: { post: { title: 'Pirate', content: 'x', structure_id: @association.id } }, headers: @member_headers
    assert_response :forbidden
    assert_not Post.exists?(title: 'Pirate')
  end

  test "un membre ne peut ni créer ni supprimer un événement" do
    category = Category.create!(name: 'AG', kind: 'event')
    event = Event.create!(title: 'Evt', structure: @association, category: category,
                          start_at: 1.day.from_now, end_at: 2.days.from_now)

    post api_events_url(subdomain: nil),
      params: { event: { title: 'Pirate', structure_id: @association.id, category: 'AG',
                         start_at: 1.day.from_now, end_at: 2.days.from_now, accesses: { '0' => 'Autre' } } },
      headers: @member_headers
    assert_response :forbidden
    delete api_event_url(subdomain: nil, id: event.id), headers: @member_headers
    assert_response :forbidden
    get api_events_url(subdomain: nil), params: { domain: 'admin' }, headers: @member_headers
    assert_response :forbidden

    assert Event.exists?(event.id)
  end

  test "un membre ne peut pas supprimer un fichier joint" do
    document = Document.create!(name: 'Statuts')
    document.file.attach(io: StringIO.new('pdf'), filename: 'statuts.pdf', content_type: 'application/pdf')
    attachment = document.file.attachment

    delete api_file_url(subdomain: nil, id: attachment.id), headers: @member_headers
    assert_response :forbidden
    assert ActiveStorage::Attachment.exists?(attachment.id)
  end

  # ---------- Administration ----------

  test "un membre ne peut pas envoyer une notification push à tout le réseau" do
    notification = PushNotification.create!(title: 'Titre', body: 'Corps')
    fake_service = Object.new
    def fake_service.send_notification(**) = raise('aucun envoi FCM attendu')

    FcmNotificationService.stub(:new, fake_service) do
      post '/api/push_notifications/send', params: { id: notification.id }, headers: @member_headers
    end
    assert_response :forbidden

    post api_push_notifications_url(subdomain: nil),
      params: { push_notification: { title: 'Pirate', body: 'x' } }, headers: @member_headers
    assert_response :forbidden
    get api_push_notifications_url(subdomain: nil), headers: @member_headers
    assert_response :forbidden

    assert_nil notification.reload.sent_at
  end

  test "un membre ne peut pas consulter ni modifier les cotisations" do
    get api_fees_url(subdomain: nil), headers: @member_headers
    assert_response :forbidden
    post api_fees_url(subdomain: nil), params: { fee: { what: '2025', amount: 1, paid_at: Date.today, member: "User-#{@member.id}" } },
      headers: @member_headers
    assert_response :forbidden
    assert_equal 0, @member.fees.count
  end

  test "un membre ne peut pas gérer les rôles, documents et catégories" do
    post api_roles_url(subdomain: nil), params: { role: { name: 'pirate' } }, headers: @member_headers
    assert_response :forbidden
    post api_documents_url(subdomain: nil), params: { url: 'https://exemple.org', name: 'Pirate' }, headers: @member_headers
    assert_response :forbidden
    delete api_document_url(subdomain: nil, id: documents(:one).id), headers: @member_headers
    assert_response :forbidden
    post api_categories_url(subdomain: nil), params: { category: { name: 'Pirate' } }, headers: @member_headers
    assert_response :forbidden

    assert_not Role.exists?(name: 'pirate')
    assert_not Document.exists?(name: 'Pirate')
    assert Document.exists?(documents(:one).id)
  end

  test "un membre peut lire les documents (app mobile)" do
    get api_documents_url(subdomain: nil), headers: @member_headers
    assert_response :success
  end

  test "un membre ne peut pas lire les référentiels d'administration" do
    get '/api/referentiels/users', headers: @member_headers
    assert_response :forbidden
    get '/api/referentiels/fees', headers: @member_headers
    assert_response :forbidden
  end
end
