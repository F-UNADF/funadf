require "test_helper"

# Présentation d'une notification (e-mail récapitulatif, liste des notifications).
class NotificationTest < ActiveSupport::TestCase
  def setup
    @association = structures(:association)
    @member = users(:simple)
  end

  def notify(notifiable)
    Notification.create!(recipient: @member, sender: @association, notifiable: notifiable, action: 'created', read: false)
  end

  test "notification d'une actu : titre, lien, extrait sans HTML, image" do
    post_record = Post.create!(title: 'Congrès', content: "<p>Le <strong>congrès</strong> aura lieu à Lyon. #{'Programme détaillé. ' * 20}</p>",
                               structure: @association)
    notification = notify(post_record)

    assert_equal 'Nouvelle actu : Congrès', notification.title
    assert_equal "http://www.example.com/actus/#{post_record.id}", notification.url
    assert_equal @association, notification.structure
    assert notification.excerpt.start_with?('Le congrès aura lieu à Lyon.')
    assert_operator notification.excerpt.length, :<=, 140
    assert_nil notification.image_url

    post_record.files.attach(io: File.open(file_fixture('image.png')), filename: 'photo.png', content_type: 'image/png')
    assert_match %r{\Ahttp://www.example.com/rails/active_storage/representations/}, notify(post_record.reload).image_url
  end

  test "notification d'un événement : titre, lien et extrait" do
    category = Category.create!(name: 'AG', kind: 'event')
    event = Event.create!(title: 'AG', description: 'Ordre du jour', structure: @association, category: category,
                          start_at: 1.day.from_now, end_at: 2.days.from_now)
    notification = notify(event)

    assert_equal 'Nouvel événement : AG', notification.title
    assert_equal "http://www.example.com/evenements/#{event.id}", notification.url
    assert_equal 'Ordre du jour', notification.excerpt
  end

  test "autre type de contenu : titre et lien par défaut" do
    notification = Notification.new(notifiable_type: 'Document')
    assert_equal 'Notification', notification.title
    assert_equal 'http://www.example.com/', notification.url
    assert_equal '', notification.excerpt
  end
end
