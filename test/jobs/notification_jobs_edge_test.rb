require "test_helper"
require "minitest/mock"

# Tâches de notification : cas limites (reprise depuis la dernière exécution,
# panne du service d'envoi pour un utilisateur).
class NotificationJobsEdgeTest < ActiveJob::TestCase
  def setup
    Notification.delete_all
    @association = structures(:association)
    @member = users(:simple)
    @member.gratitudes.create!(level: 'Pasteur APE', start_at: Date.new(2020, 1, 1))
  end

  test "événements : seuls ceux créés depuis la dernière exécution sont notifiés" do
    category = Category.create!(name: 'AG', kind: 'event')
    old = Event.create!(title: 'Ancien', structure: @association, category: category, start_at: 1.day.from_now, end_at: 2.days.from_now)
    old.accesses.create!(level: 'Pasteur APE', can_access: true)
    JobRun.create!(job_name: NotificationEventBroadcastJob::JOB_NAME, ran_at: 1.minute.from_now)

    NotificationEventBroadcastJob.perform_now
    assert_equal 0, Notification.count
  end

  test "digest : une panne pour un utilisateur n'arrête pas l'envoi aux suivants" do
    other = users(:other)
    [@member, other].each do |user|
      user.device_tokens.create!(token: "jeton-#{user.id}", platform: 'mobile')
      Notification.create!(recipient: user, sender: @association, notifiable: Post.create!(title: 'A', content: 'x', structure: @association),
                           action: 'created', read: false)
    end

    calls = []
    failing = "jeton-#{@member.id}"
    service = Object.new
    service.define_singleton_method(:send_notification) do |token:, **|
      calls << token
      raise 'panne FCM' if token == failing
      { error: nil }
    end

    FcmNotificationService.stub(:new, service) { NotificationDigestJob.perform_now }
    assert_equal 2, calls.size
    assert_not_nil Notification.find_by(recipient: other).notified_at
    assert_nil Notification.find_by(recipient: @member).notified_at
  end
end
