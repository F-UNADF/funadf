# app/controllers/v1/users_controller.rb
module V1
  class VotesController < ApplicationController
    respond_to :json
    skip_before_action :verify_authenticity_token

    # GET /votes
    def index
      @user = User.find_by(authentication_token: params[:token])

      sql = "
        SELECT c.id AS campaign_id,
                c.name AS campaign_name,
                c.description AS campaign_description,
                s.name AS structure_name
        FROM campaigns c
        JOIN structures s ON s.id = c.structure_id
        JOIN memberships m ON m.structure_id = c.structure_id AND m.member_type = 'User' AND m.member_id = ?
        LEFT JOIN roles r ON r.id = m.role_id
        WHERE c.state IN ('opened', 'coming')
        AND (r.name = 'president' OR r.name = 'member')"

      values = [@user.id]

      result = ActiveRecord::Base.connection.select_all(ActiveRecord::Base.send(:sanitize_sql_array, [sql, *values]))

      # @campaigns = Campaign.currents
      #
      # @presidences = @user.get_presidences
      #
      # campaing_ids = []
      #
      # @campaigns.each do |campaign|
      #   @presidences.each_with_index do |s, index|
      #     if campaign.structure.is_member?(s)
      #       if campaign.structure.member_can_vote?(s) && !campaign.has_already_vote?(s)
      #         # MEMBRE DE L'ASSOC, CAN_VOTE
      #         campaing_ids << campaign.id
      #
      #         break
      #       elsif !campaign.structure.member_can_vote?(s)
      #         # MEMBRE DE L'ASSOC, MAIS CANT_VOTE
      #         campaing_ids << campaign.id
      #
      #         break
      #       end
      #
      #     elsif campaign.structure_can_vote?(s, false) && !campaign.has_already_vote?(s)
      #       # NON MEMBRE, CAN VOTE
      #       campaing_ids << campaign.id
      #       break
      #     end
      #   end
      #
      #   if campaign.structure.is_member?(@user)
      #     if campaign.structure.member_can_vote?(@user) && campaign.user_can_vote?(@user) && !campaign.has_already_vote?(@user)
      #       # MEMBRE DE L'ASSOC, CAN_VOTE
      #       campaing_ids << campaign.id
      #
      #     elsif !campaign.structure.member_can_vote?(@user)
      #
      #       # MEMBRE DE L'ASSOC, MAIS CANT_VOTE
      #       campaing_ids << campaign.id
      #     end
      #
      #   elsif campaign.user_can_vote?(@user, false) && !campaign.has_already_vote?(@user)
      #     # NON MEMBRE, CAN VOTE
      #     campaing_ids << campaign.id
      #   end
      #
      # end

      render json: { campaigns: result, token: params[:token] }
    end

    def show
      @campaign = Campaign.find params[:id]
      @structure = Structure.find(@campaign.structure_id)

      @user = User.find_by(authentication_token: params[:token])
      # GET ALL PRESIDENCES
      pres = @user.get_presidences
      @presidences = []
      pres.each do |s|
        unless s == @structure
          @presidences << s
        end
      end

      render json: { campaign: @campaign.as_json, motions: @campaign.motions.as_json, presidences: @presidences.as_json }
    end
  end
end
