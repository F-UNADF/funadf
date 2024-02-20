require "test_helper"

class MeetingTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end

  test "it should have a name" do
    meeting = Meeting.new
    assert_not meeting.save
  end

  test "it could have attendees" do
    meeting = meetings(:one)
    meeting.save

    meeting.attendees.create(user: users(:simple))

    assert_equal 1, meeting.attendees.count
  end
end
