class ResultsController < ApplicationController

  def index


    # JE SUIS PRESIDENT
    presidences = current_user.get_presidences.map{ |struc| struc.id}

    motions_ids = Voter.where(resource_id: presidences, resource_type: 'Structure').pluck(:motion_id)
    my_motions_ids = Voter.where(resource_id: current_user.id, resource_type: 'User').pluck(:motion_id)
    campaigns_ids = Motion.where(id: [motions_ids+my_motions_ids]).pluck(:campaign_id)



    @campaigns = Campaign.where(id: campaigns_ids, state: :closed).order(start_at: :desc).paginate(:page => params[:page])
  end

  def show
    @campaign = Campaign.find params[:id]
  end
end
