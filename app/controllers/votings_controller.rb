class VotingsController < ApplicationController

  def create
    @campaign = Campaign.find params[:votings][:campaign_id]
    ActiveRecord::Base.transaction do
      begin
        params[:voter].each do |index, voter|
          Voter.create(voter)
        end

        params[:vote].each do |index, vote|
          Vote.create(vote)
        end
        redirect_to :campaigns, alert: "Votre vote a bien été pris en compte"
      rescue ActiveRecord::StatementInvalid
        redirect_to @campagn
      end
    end
  end

end