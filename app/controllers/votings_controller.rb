class VotingsController < ApplicationController

  def create
    @campaign = Campaign.find params[:votings][:campaign_id]
    @structure = Structure.find(@campaign.structure_id)

    params[:votings][:voter].each do |voter|
      unless voter[:resource_id].blank?
        @elector = @structure.electors.find_by(resource_id: voter[:resource_id], resource_type: voter[:resource_class])

        params[:vote].each do |index, vote|
          if @elector.blank?
            Voter.create(motion_id: vote[:motion_id],
                        voted_at: Time.now,
                        ip: request.remote_ip,
                        resource_id: voter[:resource_id],
                        resource_type: voter[:resource_class])
            vote[:is_consultative] = true
          else
            Voter.create(motion_id: vote[:motion_id],
                        voted_at: Time.now,
                        ip: request.remote_ip,
                        elector_id: @elector.id)
            vote[:is_consultative] = false
          end
          Vote.create(motion_id: vote[:motion_id], result: vote[:result], is_consultative: vote[:is_consultative])
        end
      end
    end

    redirect_to :campaigns, alert: "Votre vote a bien été pris en compte"
  end

end