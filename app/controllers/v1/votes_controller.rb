# app/controllers/v1/users_controller.rb
module V1
  class VotesController < ApplicationController
    respond_to :json
    skip_before_action :verify_authenticity_token

    # GET /votes
    def index
      @user = User.find_by(authentication_token: params[:token])

      if(@user.blank?)
        render json: { status: 'ko', message: 'Token is not valid' }
      end

      campaing_ids = @user.eligible_campaign_ids

      render json: { campaigns: Campaign.where(id: campaing_ids) }, include: [:structure => { only: :name }]
    end

    def show
      @campaign = Campaign.find params[:id]
      @structure = Structure.find(@campaign.structure_id)
      @user = User.find_by(authentication_token: params[:token])

      sql = "
        SELECT
          s2.name as name,
          s2.town,
          m.member_id AS resource_id,
          m.member_type AS resource_type,
          (vt.voting <> 'count') AS is_consultative,
          (SELECT COUNT(*) FROM voters v WHERE v.motion_id = mo.id AND v.resource_id = m.member_id AND v.resource_type = m.member_type) AS has_voted
        FROM structures s
        INNER JOIN memberships m ON m.structure_id = s.id
                  AND m.member_type = 'Structure'
                  AND m.member_id IN (SELECT s.id
                    FROM structures s
                    INNER JOIN memberships m ON m.structure_id = s.id AND m.member_type = 'User' AND m.member_id = ?
                    INNER JOIN roles r ON r.id = m.role_id AND r.name IN ('president')
                  )
        INNER JOIN voting_tables vt ON vt.voting <> 'not' AND vt.`position` = 'eglises'
        INNER JOIN campaigns c ON c.id = vt.campaign_id AND c.id = ?
        INNER JOIN motions mo ON mo.campaign_id = c.id
        INNER JOIN voters v ON v.motion_id = mo.id
        INNER JOIN structures s2 ON s2.id = m.member_id
        AND s.id = ?
        UNION
        SELECT
          CONCAT(u.firstname, ' ', u.lastname) as name,
          u.town,
          m.member_id AS resource_id,
          m.member_type AS resource_type,
          (vt.voting <> 'count') AS is_consultative,
          (SELECT COUNT(*) FROM voters v WHERE v.motion_id = mo.id AND v.resource_id = m.member_id AND v.resource_type = m.member_type) AS has_voted
        FROM memberships m
        INNER JOIN voting_tables vt ON vt.voting <> 'not' AND vt.`position` = ?
        INNER JOIN campaigns c ON c.id = vt.campaign_id
        INNER JOIN motions mo ON mo.campaign_id = c.id
        LEFT OUTER JOIN voters v ON v.motion_id = mo.id
        INNER JOIN users u ON u.id = m.member_id
        WHERE m.member_type = 'User' AND m.member_id = ?
        AND c.id = ?"

      values = [@user.id, @campaign.id, @structure.id, @user.level, @user.id, @campaign.id]
      result = ActiveRecord::Base.connection.select_all(ActiveRecord::Base.send(:sanitize_sql_array, [sql, *values]))


      render json: { 
        campaign: @campaign.as_json, 
        structure: @campaign.structure, 
        motions: @campaign.motions.as_json, 
        voters: results.as_json, 
        meeting: @campaign.meeting,
        present: (!@campaign.meeting.present? || @campaign.meeting.user_is_present?(@user))
      }
    end

    def create
      params[:voters].each do |voter|
        if voter[:selected] === true
          params[:results].each do |vote|
            exist_voter = Voter.where(motion_id: vote[:motion_id], resource_id: voter[:resource_id], resource_type: voter[:resource_type])
            if exist_voter.blank?
              Voter.create(motion_id: vote[:motion_id],
                          voted_at: Time.now,
                          ip: request.remote_ip,
                          resource_id: voter[:resource_id],
                          resource_type: voter[:resource_type])

              if vote[:vote].kind_of?(Array)
                vote[:vote].each do |v|
                  Vote.create(motion_id: vote[:motion_id], result: v, is_consultative: voter[:is_consultative])
                end
              else
                Vote.create(motion_id: vote[:motion_id], result: vote[:vote], is_consultative: voter[:is_consultative])
              end
            end
          end
        end
      end
      render json: { status: 'ok' }
    end
  end
end
