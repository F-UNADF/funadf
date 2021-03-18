class CampaignsController < ApplicationController

  def index
    @campaigns = Campaign.currents.paginate(:page => params[:page])
  end

  def show
    @campaign = Campaign.find params[:id]
    @structure = Structure.find(@campaign.structure_id)

    @user = current_user
    # GET ALL PRESIDENCES
    pres = @user.get_presidences
    @presidences = []
    pres.each do |s|
      unless s == @structure
        @presidences << s
      end
    end

  end

end