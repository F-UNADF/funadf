class CampaignsController < ApplicationController

  def index
    @campaigns = Campaign.currents

    @user = current_user
    # GET ALL PRESIDENCES
    pres = @user.get_presidences
    @presidences = []
    pres.each do |s|
      unless s == @structure
        @presidences << s
      end
    end

    campaing_ids = []

    @campaigns.each do |campaign|
      @presidences.each_with_index do |s, index|
        if campaign.structure.is_member?(s)
          if campaign.structure.member_can_vote?(s) && !campaign.has_already_vote?(s)
            # MEMBRE DE L'ASSOC, CAN_VOTE
            campaing_ids << campaign.id

            break
          elsif !campaign.structure.member_can_vote?(s)
            # MEMBRE DE L'ASSOC, MAIS CANT_VOTE
            campaing_ids << campaign.id

            break
          end


        elsif campaign.structure_can_vote?(s, false) && !campaign.has_already_vote?(s)
          # NON MEMBRE, CAN VOTE
          campaing_ids << campaign.id
          break
        end
      end

      if campaign.structure.is_member?(@user)
        if campaign.structure.member_can_vote?(@user) && campaign.user_can_vote?(@user) && !campaign.has_already_vote?(@user)
          # MEMBRE DE L'ASSOC, CAN_VOTE
          campaing_ids << campaign.id


        elsif !campaign.structure.member_can_vote?(@user)

          # MEMBRE DE L'ASSOC, MAIS CANT_VOTE
          campaing_ids << campaign.id
        end

      elsif campaign.user_can_vote?(@user, false) && !campaign.has_already_vote?(@user)
        # NON MEMBRE, CAN VOTE
        campaing_ids << campaign.id
      end

    end

    @campaigns = Campaign.where(id: campaing_ids).order(start_at: :asc)
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