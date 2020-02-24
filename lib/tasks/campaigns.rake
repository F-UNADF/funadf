namespace :campaigns do

  desc "Add Meeting to Campaign"

  task :add_meeting_to_campaign => :environment do |t, args|
    
    campaigns = Campaign.all

    campaigns.each do |campaign|
      meeting_name = campaign.name

      meeting = Meeting.find_or_create_by(name: meeting_name)

      campaign.meeting_id = meeting.id
      campaign.save
    end

  end
end