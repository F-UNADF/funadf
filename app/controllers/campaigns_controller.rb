class CampaignsController < ApplicationController

  def index
    @member_campaigns = Campaign.get_campaigns_for_member current_user

    @president_structure = Structure.get_structure_with_president(current_user)

    @president_campaigns = []

    @president_structure.each do |structure|
      @president_campaigns << [structure, Campaign.get_campaigns_for_structure(structure)]
    end
  end

  def show
    @campaign = Campaign.find params[:id]

    @elector = Elector.find_by(resource_id: params[:resource_id], resource_type: params[:resource_type], structure_id: @campaign.structure_id)

    puts "%%"*30
    puts @elector.inspect
  end

end