class Api::CampaignsController < ApiController
  before_action :set_campaign, only: [:show, :update, :destroy, :change_state, :voters_count]

  def index
    domain = params[:domain] || 'me'
    campaigns = []

    case domain
    when 'admin'
      campaigns = Campaign
                    .joins(:structure)
                    .select('campaigns.*, structures.name AS structure_name')
                    .order(id: :desc)
    when 'association'
      campaigns = campaigns_for(current_user.associations_responsabilities)
    when 'region'
      campaigns = campaigns_for(current_user.regions_responsabilities)
    end

    render json: { campaigns: campaigns }
  end

  def show
    motions         = @campaign.motions.order(id: :asc)
    voting_tables   = @campaign.voting_tables
    results         = @campaign.results
    choices_results = @campaign.choices_results
    free_results    = @campaign.free_results
    voters          = @campaign.voters
    render json: {
      campaign:        @campaign,
      motions:         motions,
      voting_tables:   voting_tables,
      results:         results,
      free_results:    free_results,
      choices_results: choices_results,
      voters:          voters
    }
  end

  def create
    campaign = Campaign.new(campaign_params)
    if campaign.save
      save_motions(campaign, params[:campaign][:motions])
      save_voting_tables(campaign, params[:campaign][:voting_tables])
      render json: { status: 200, campaign: campaign }
    else
      render json: { status: 422, errors: campaign.errors }
    end
  end

  def update
    if @campaign.update(campaign_params)
      save_motions(@campaign, params[:campaign][:motions])
      save_voting_tables(@campaign, params[:campaign][:voting_tables])
      render json: { status: 200, campaign: @campaign }
    else
      render json: { status: 422, errors: @campaign.errors }
    end
  end

  def destroy
    @campaign.destroy
    render json: { status: 200 }
  end

  def change_state
    if @campaign.fire_state_event(params[:state_event])
      render json: { status: 200, campaign: @campaign }
    else
      render json: { status: 422, errors: @campaign.errors }
    end
  end

  def voters_count

    voters_count = @campaign.voters.count
    render json: { voters_count: voters_count }
  end

  private

  def save_motions(campaign, motions_params)
    motion_ids = motions_params.map { |motion| motion[:id] }
    Motion.where(campaign_id: campaign.id).where.not(id: motion_ids).delete_all
    motions_params.each do |motion_params|
      motion = campaign.motions.find_by(id: motion_params[:id])

      if motion.nil?
        campaign.motions.build(
          name:    motion_params[:name],
          kind:    motion_params[:kind],
          order:   motion_params[:order],
          choices: motion_params[:choices],
          max_choice: motion_params[:max_choice]
        )
      else
        motion.update(
          name:    motion_params[:name],
          kind:    motion_params[:kind],
          order:   motion_params[:order],
          choices: motion_params[:choices],
          max_choice: motion_params[:max_choice]
        )
      end
    end

    campaign.save
  end

  def save_voting_tables(campaign, voting_tables_params)
    voting_table_ids = voting_tables_params.map { |voting_table| voting_table[:id] }
    VotingTable.where(campaign_id: campaign.id).where.not(id: voting_table_ids).delete_all
    voting_tables_params.each do |voting_table_params|
      voting_table = campaign.voting_tables.find_by(id: voting_table_params[:id])

      if voting_table.nil?
        campaign.voting_tables.build(
          position:  voting_table_params[:position],
          as_member: voting_table_params[:as_member],
          voting:    voting_table_params[:voting],
        )
      else
        voting_table.update(
          position:  voting_table_params[:position],
          as_member: voting_table_params[:as_member],
          voting:    voting_table_params[:voting],
        )
      end
    end

    campaign.save
  end

  def set_campaign
    @campaign = Campaign.find(params[:id])
  end

  def campaign_params
    params[:campaign].permit(:name, :structure_id, :meeting_id)
  end

  def campaigns_for(responsabilities)
    structure_ids = responsabilities.pluck(:id)
    return [] if structure_ids.empty?

    Campaign.joins(:structure)
            .select('campaigns.*, structures.name AS structure_name')
            .where(structure_id: structure_ids).order(id: :desc)
  end

end