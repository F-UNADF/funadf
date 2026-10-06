require "test_helper"

# Petites règles des contenus : image de notification non redimensionnable,
# sérialisation partielle d'une actu, jeton SSO à usage unique.
class ContentModelsTest < ActiveSupport::TestCase
  def setup
    @association = structures(:association)
  end

  test "une image non redimensionnable ne donne pas d'image de notification" do
    post_record = Post.create!(title: 'SVG', content: 'x', structure: @association)
    post_record.files.attach(io: StringIO.new('<svg xmlns="http://www.w3.org/2000/svg"/>'), filename: 'logo.svg', content_type: 'image/svg+xml')
    notification = Notification.create!(recipient: users(:simple), sender: @association, notifiable: post_record.reload, action: 'created', read: false)

    assert_nil notification.image_url
  end

  test "une actu sérialisée sans son contenu" do
    post_record = Post.create!(title: 'Sans contenu', content: '<p>x</p>', structure: @association)
    json = post_record.as_json(except: [:content])
    assert_not json.key?('content')
    assert_equal 'Sans contenu', json['title']
  end

  test "visibilité d'une actu : adhésion directe et niveau autorisé" do
    user = users(:simple)
    post_record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    post_record.accesses.create!(level: User::NO_LEVEL, can_access: true)
    assert_not post_record.visible_to?(user)

    user.add_role :member, @association
    assert post_record.visible_to?(user)
  end

  test "jeton SSO : usage unique et durée de vie courte" do
    token = users(:simple).sso_tokens.create!
    assert token.usable?
    assert token.consume!
    assert_not token.consume!, "déjà utilisé"

    expired = users(:simple).sso_tokens.create!(expires_at: 1.minute.ago)
    assert_not expired.consume!
    assert_not_includes SsoToken.usable, expired
  end
end
