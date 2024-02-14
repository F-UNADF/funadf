class Api::VotesController < ApiController

  # GET /votes
  def index
    @campaigns = Campaign.currents

    @user = current_user

    campaing_ids = @user.eligible_campaign_ids

    render json: { campaigns: Campaign.where(id: campaing_ids) }, include: [:structure => { only: :name }]
  end

  def show
    @campaign = Campaign.find params[:id]
    @structure = Structure.find(@campaign.structure_id)
    @user = current_user

    sql = "
      SELECT
          s2.name as name,
          s2.town,
          m.member_id AS resource_id,
          m.member_type AS resource_type,
          (vt.voting <> 'count') AS is_consultative,
          (SELECT COALESCE(COUNT(v.resource_id), 0)
            FROM voters v
            JOIN motions m ON m.id = v.motion_id AND m.campaign_id = :campaign_id
            WHERE v.resource_id = s2.id AND v.resource_type = 'Structure'
            GROUP BY v.resource_id, v.resource_type) AS has_voted
      FROM campaigns c
      JOIN structures s ON s.id = c.structure_id
      JOIN memberships m ON m.structure_id = s.id
      JOIN structures s2 ON s2.id = m.member_id
      JOIN voting_tables vt ON vt.campaign_id = c.id AND vt.`position` = 'Eglises' AND vt.as_member = 1
      WHERE c.id = :campaign_id
      AND m.member_type = 'Structure'
      AND m.member_id IN(
          SELECT s.id
          FROM users u
          JOIN memberships m ON m.member_type = 'User' AND m.member_id = u.id
          JOIN structures s ON s.id = m.structure_id
          JOIN roles r ON r.id = m.role_id
          WHERE u.id = :user_id
          AND r.name = 'president'
          AND s.`type` = 'Church'
      )
      UNION
      SELECT
          s2.name as name,
          s2.town,
          m.member_id AS resource_id,
          m.member_type AS resource_type,
          (vt.voting <> 'count') AS is_consultative,
          (SELECT COALESCE(COUNT(v.resource_id), 0)
            FROM voters v
            JOIN motions m ON m.id = v.motion_id AND m.campaign_id = :campaign_id
            WHERE v.resource_id = s2.id AND v.resource_type = 'Structure'
            GROUP BY v.resource_id, v.resource_type) AS has_voted
      FROM campaigns c
      JOIN structures s ON s.id = c.structure_id
      JOIN memberships m ON m.structure_id = s.id
      JOIN structures s2 ON s2.id = m.member_id
      JOIN voting_tables vt ON vt.campaign_id = c.id AND vt.`position` = 'Oeuvres' AND vt.as_member = 1
      WHERE c.id = :campaign_id
      AND m.member_type = 'Structure'
      AND m.member_id IN(
          SELECT s.id
          FROM users u
          JOIN memberships m ON m.member_type = 'User' AND m.member_id = u.id
          JOIN structures s ON s.id = m.structure_id
          JOIN roles r ON r.id = m.role_id
          WHERE u.id = :user_id
          AND r.name = 'president'
          AND s.`type` = 'Association'
      )
      UNION
      SELECT
          CONCAT(u.firstname, ' ', u.lastname) as name,
          u.town,
          m.member_id AS resource_id,
          m.member_type AS resource_type,
          (vt.voting <> 'count') AS is_consultative,
          (SELECT COALESCE(COUNT(v.resource_id), 0)
            FROM voters v
            JOIN motions m ON m.id = v.motion_id AND m.campaign_id = :campaign_id
            WHERE v.resource_id = u.id AND v.resource_type = 'User'
            GROUP BY v.resource_id, v.resource_type) AS has_voted
      FROM campaigns c
      JOIN structures s ON s.id = c.structure_id
      JOIN memberships m ON m.structure_id = s.id
      JOIN users u ON u.id = m.member_id AND m.member_type = 'User'
      JOIN voting_tables vt ON vt.campaign_id = c.id AND vt.`position` = :user_level
      WHERE c.id = :campaign_id
      AND u.id = :user_id"

    results = Campaign.find_by_sql([sql, campaign_id: @campaign.id, user_id: @user.id, user_level: @user.level])


    render json: { campaign: @campaign.as_json, structure: @campaign.structure, motions: @campaign.motions.as_json, voters: results.as_json }
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

