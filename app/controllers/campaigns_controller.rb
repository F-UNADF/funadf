class CampaignsController < ApplicationController
  def show
    @campaign = Campaign.find params[:id]

    respond_to do |format|
      format.pdf do
        render pdf: "#{@campaign.name} - resultats", layout: "votes/layouts/pdf"
      end
    end
  end
end