class Api::CampaignsController < ApiController
  before_action :set_campaign, only: [:show, :update, :destroy, :change_state, :voters_count]

  def index
    campaigns = Campaign.joins(:structure).select('campaigns.*, structures.name AS structure_name').order id: :desc
    if !@structure.nil?
      campaigns = @structure.campaigns.joins(:structure).select('campaigns.*, structures.name AS structure_name').order id: :desc
    end
    if current_user.has_any_role?(:president, :treasurer, :secretary) && !current_user.is_admin?
      campaigns = Campaign.joins(:structure).where(structure_id: current_user.associations_responsabilities.pluck(:id)).select('campaigns.*, structures.name AS structure_name').order id: :desc
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
          choices: motion_params[:choices]
        )
      else
        motion.update(
          name:    motion_params[:name],
          kind:    motion_params[:kind],
          order:   motion_params[:order],
          choices: motion_params[:choices]
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
    params[:campaign].permit(:name, :structure_id)
  end

end