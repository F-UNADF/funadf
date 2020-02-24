class AddMeetingToCampaigns < ActiveRecord::Migration
  def change
    add_reference :campaigns, :meeting
  end
end
