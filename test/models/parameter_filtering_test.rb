require "test_helper"

# Les journaux de production partent vers Logtail : aucun jeton ni secret en clair.
class ParameterFilteringTest < ActiveSupport::TestCase
  test "les jetons et secrets sont masqués dans les journaux" do
    filter = ActiveSupport::ParameterFilter.new(Rails.application.config.filter_parameters)
    params = {
      'password' => 'x', 'token' => 'jeton-fcm', 'reset_password_token' => 'x', 'invitation_token' => 'x',
      'user' => { 'user' => { 'password' => 'x', 'fcm_token' => 'x' }, 'invitation_token' => 'x' },
      'email' => 'membre@yopmail.com'
    }
    filtered = filter.filter(params)

    assert_equal '[FILTERED]', filtered['token']
    assert_equal '[FILTERED]', filtered['reset_password_token']
    assert_equal '[FILTERED]', filtered['invitation_token']
    assert_equal '[FILTERED]', filtered['user']['user']['fcm_token']
    assert_equal '[FILTERED]', filtered['user']['invitation_token']
    assert_equal '[FILTERED]', filtered['password']
    assert_equal 'membre@yopmail.com', filtered['email']
  end
end
