class CampaignsController < ApplicationController

  def index
    @member_campaigns = Campaign.get_campaigns_for_member(current_user).paginate(:page => params[:member_page], :per_page => 10)

    @president_structure = Structure.get_structure_with_president(current_user).paginate(:page => params[:president_page], :per_page => 10)

    @president_campaigns = []

    @president_structure.each do |structure|
      @president_campaigns << [structure, Campaign.get_campaigns_for_structure(structure)]
    end

    @public_campaigns = Campaign.get_public_campaigns(current_user).paginate(:page => params[:public_campaigns], :per_page => 10)
  end

  def show
    @campaign = Campaign.find params[:id]

    if @campaign.is_public
      @elector = User.find(params[:resource_id])
    else
      @elector = Elector.find_by(resource_id: params[:resource_id], resource_type: params[:resource_type], structure_id: @campaign.structure_id)
    end
  end

end