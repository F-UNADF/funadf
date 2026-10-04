require "test_helper"
require "minitest/mock"

# Tâches planifiées (config/sidekiq.yml) : création des notifications à partir
# des actus et événements, envoi groupé des push, récap hebdomadaire par e-mail.
class NotificationJobsTest < ActiveJob::TestCase
  include ActionMailer::TestHelper

  def setup
    Notification.delete_all # notifications des fixtures, sans destinataire réel
    @association = structures(:association)
    @member = users(:simple)
    @other  = users(:other)
    @member.add_role :member, @association
    @member.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2020, 1, 1))
    @other.gratitudes.create!(level: 'Probatoire', start_at: Date.new(2020, 1, 1))
  end

  def fake_fcm(sent, error: nil)
    Object.new.tap do |service|
      service.define_singleton_method(:send_notification) { |**args| sent << args; { error: error } }
    end
  end

  test "actus : notifie les membres de la structure au niveau autorisé, une seule fois" do
    post_record = Post.create!(title: 'Actu', content: 'x', structure: @association, published_at: 1.hour.ago)
    post_record.accesses.create!(level: 'Pasteur APE', can_access: true)
    Post.create!(title: 'Ancienne', content: 'x', structure: @association, published_at: 2.days.ago)
      .accesses.create!(level: 'Pasteur APE', can_access: true)

    NotificationPostBroadcastJob.perform_now
    assert_equal [[@member.id, post_record.id]], Notification.pluck(:recipient_id, :notifiable_id)
    assert JobRun.find_by(job_name: NotificationPostBroadcastJob::JOB_NAME).ran_at > 1.minute.ago

    NotificationPostBroadcastJob.perform_now
    assert_equal 1, Notification.count, "une actu déjà traitée n'est pas notifiée à nouveau"
  end

  test "événements : notifie les utilisateurs au niveau autorisé" do
    category = Category.create!(name: 'AG', kind: 'event')
    event = Event.create!(title: 'AG', structure: @association, category: category,
                          start_at: 1.day.from_now, end_at: 2.days.from_now)
    event.accesses.create!(level: 'Pasteur APE', can_access: true)

    NotificationEventBroadcastJob.perform_now
    assert_equal [@member.id], Notification.where(notifiable: event).pluck(:recipient_id)
    assert JobRun.exists?(job_name: NotificationEventBroadcastJob::JOB_NAME)
  end

  test "digest : un push par appareil avec le nombre de notifications non lues" do
    post_record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    2.times { Notification.create!(recipient: @member, sender: @association, notifiable: post_record, action: 'created', read: false) }
    Notification.create!(recipient: @member, sender: @association, notifiable: post_record, action: 'created', read: true)
    DeviceToken.create!(user: @member, token: 'telephone', platform: 'mobile')
    DeviceToken.create!(user: @member, token: 'navigateur', platform: 'web')

    sent = []
    FcmNotificationService.stub(:new, fake_fcm(sent)) { NotificationDigestJob.perform_now }

    assert_equal %w[navigateur telephone], sent.map { |s| s[:token] }.sort
    assert_equal [2], sent.map { |s| s[:badge] }.uniq
    assert_match '2 notifications', sent.first[:body]
    assert_equal 0, Notification.where(read: false, notified_at: nil).count

    sent.clear
    FcmNotificationService.stub(:new, fake_fcm(sent)) { NotificationDigestJob.perform_now }
    assert_empty sent, "les notifications déjà envoyées ne repartent pas"
  end

  test "digest : une erreur FCM n'empêche pas de marquer les notifications envoyées" do
    post_record = Post.create!(title: 'Actu', content: 'x', structure: @association)
    Notification.create!(recipient: @member, sender: @association, notifiable: post_record, action: 'created', read: false)
    DeviceToken.create!(user: @member, token: 'perime', platform: 'mobile')

    sent = []
    FcmNotificationService.stub(:new, fake_fcm(sent, error: { 'code' => 404 })) { NotificationDigestJob.perform_now }
    assert_equal 1, sent.size
    assert_equal 0, Notification.where(notified_at: nil).count
  end

  test "récap hebdomadaire : un e-mail par destinataire de la semaine précédente" do
    post_record = Post.create!(title: 'Actu de la semaine', content: 'x', structure: @association)
    last_week = Time.zone.now.beginning_of_week - 4.days
    Notification.create!(recipient: @member, sender: @association, notifiable: post_record, action: 'created', created_at: last_week)
    Notification.create!(recipient: @other, sender: @association, notifiable: post_record, action: 'created', created_at: 1.month.ago)

    assert_enqueued_emails 1 do
      WeeklyNotificationRecapJob.perform_now
    end
  end

  test "e-mail du récap hebdomadaire" do
    post_record = Post.create!(title: 'Actu de la semaine', content: 'x', structure: @association)
    notification = Notification.create!(recipient: @member, sender: @association, notifiable: post_record, action: 'created')

    mail = UserMailer.notification_digest(@member, [notification.id])
    assert_equal [@member.email], mail.to
    assert_equal '[ADD+] Le récap de la semaine !', mail.subject
    assert_match 'Actu de la semaine', mail.body.encoded
  end
end
