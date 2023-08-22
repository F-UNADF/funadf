class Api::CampaignsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_campaign, only: [:show, :update, :destroy]

  def index
    campaigns = Campaign.order id: :desc
    render json: { campaigns: campaigns }
  end

  def show
    motions       = @campaign.motions.order(id: :asc)
    voting_tables = @campaign.voting_tables
    render json: { campaign: @campaign, motions: motions, voting_tables: voting_tables }
  end

  def create
    campaign = Campaign.new(church_params)
    if campaign.save
      save_motions(@campaign, params[:campaign][:motions])
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

  private

  def save_motions(campaign, motions_params)
    motion_ids = motions_params.map { |motion| motion[:id] }
    Motion.where(campaign_id: @campaign.id).where.not(id: motion_ids).delete_all
    motions_params.each do |motion_params|
      motion = campaign.motions.find_by(id: motion_params[:id])

      if motion.nil?
        campaign.motions.build(
          name:  motion_params[:name],
          kind:  motion_params[:kind],
          order: motion_params[:order]
        )
      else
        motion.update(
          name:  motion_params[:name],
          kind:  motion_params[:kind],
          order: motion_params[:order]
        )
      end
    end

    campaign.save
  end

  def save_voting_tables(campaign, voting_tables_params)
    voting_table_ids = voting_tables_params.map { |voting_table| voting_table[:id] }
    VotingTable.where(campaign_id: @campaign.id).where.not(id: voting_table_ids).delete_all
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