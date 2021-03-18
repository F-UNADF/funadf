namespace :voters do

  desc "Elector become resource"

  task :elector_become_resource => :environment do |t, args|


    Voter.all.each do |voter|

      if voter.elector

        puts voter.inspect

        puts voter.elector.inspect

        #clas

        puts voter.elector.resource_type.titleize

        new_voter = Voter.create(motion_id: voter.motion_id,
                        voted_at: voter.voted_at,
                        ip: voter.ip,
                        resource_id: voter.elector.resource_id,
                        resource_type: voter.elector.resource_type.titleize)

        puts new_voter

        voter.delete

      end
    end

  end
end