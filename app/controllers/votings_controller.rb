class VotingsController < ApplicationController

  def create
    @campaign = Campaign.find params[:votings][:campaign_id]
    @structure = Structure.find(@campaign.structure_id)


    params[:votings][:voter].each do |voter|

      unless voter[:resource_id].blank?
        params[:vote].each do |index, vote|

          exist_voter = Voter.where(motion_id: vote[:motion_id], resource_id: voter[:resource_id], resource_type: voter[:resource_class])

          if exist_voter.blank?
            Vote.create(motion_id: vote[:motion_id], result: vote[:result], is_consultative: voter[:is_consultative])
            Voter.create(motion_id: vote[:motion_id],
                          voted_at: Time.now,
                          ip: request.remote_ip,
                          resource_id: voter[:resource_id],
                          resource_type: voter[:resource_class])
          end
        end
      end

    end

    redirect_to :campaigns, alert: "Votre vote a bien été pris en compte"
  end

end