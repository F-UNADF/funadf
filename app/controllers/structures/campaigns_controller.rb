class Structures::CampaignsController < ApplicationController
  before_action :set_structure

  def index
    @campaigns = @structure.campaigns.order(start_at: :desc).paginate(:page => params[:page])
  end

  def show
    @campaign = @structure.campaigns.find params[:id]

    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@campaign.name} - resultats", layout: "votes/layouts/pdf"
      end
    end
  end

  def new
    @campaign = @structure.campaigns.build
  end

  def create
    @campaign = @structure.campaigns.build(campaign_params)
    if @campaign.save
      redirect_to [@structure.becomes(Structure), @campaign], notice: "Campagne créée"
    else
      render :new
    end
  end

  def edit
    @campaign = @structure.campaigns.find params[:id]
  end

  def update
    @campaign = @structure.campaigns.find params[:id]
    if @campaign.update(campaign_params)
      redirect_to [@structure.becomes(Structure), @campaign], flash:{success: 'Campagne mise à jours.'}
     else
      render :edit
    end
  end

  def destroy
    @campaign = @structure.campaigns.find params[:id]

    @campaign.motions.each do |motion|
      Voter.where(motion_id: motion.id).delete_all
      Vote.where(motion_id: motion.id).delete_all
    end
    @campaign.motions.delete_all

    @campaign.destroy

    redirect_to [@structure.becomes(Structure), :campaigns], notice: "Campagne supprimée"
  end


  def close_definitly
    @campaign = Campaign.find params[:campaign_id]
    @campaign.close_definitly
    redirect_to :back
  end

  def close_temporarily
    @campaign = Campaign.find params[:campaign_id]
    @campaign.close_temporarily
    redirect_to :back
  end

  def open
    @campaign = Campaign.find params[:campaign_id]
    @campaign.opening
    redirect_to :back
  end

  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

    def campaign_params
      params[:campaign].permit(:name, :description, :code, :start_at, :end_at, :is_public,
                                motions_attributes: [:id, :name, :kind, :order, :_destroy],
                                voting_tables_attributes: [:id, :position, :voting, :as_member, :_destroy])
    end

end