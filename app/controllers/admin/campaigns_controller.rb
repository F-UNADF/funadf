class Admin::CampaignsController < AdminController
  before_action :set_campaign, only: [:show, :edit, :update, :destroy, :close_definitly, :close_temporarily, :open]

  # GET /admin/campaigns
  # GET /admin/campaigns.json
  def index
    @q = Campaign.order(id: :desc).ransack(params[:q])
    @campaigns = @q.result(distinct: true).paginate(:page => params[:page])
  end

  # GET /admin/campaigns/1
  # GET /admin/campaigns/1.json
  def show
    @structure = @campaign.structure

    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@campaign.name} - resultats", layout: "votes/layouts/pdf"
      end
    end
  end

  # GET /admin/campaigns/new
  def new
    @campaign = Campaign.new
    @structures = Association.order(name: :asc)
  end

  # GET /admin/campaigns/1/edit
  def edit
    @structures = Association.order(name: :asc)
  end

  # POST /admin/campaigns
  # POST /admin/campaigns.json
  def create
    @campaign = Campaign.new(campaign_params)
    @structures = Association.order(name: :asc)

    if @campaign.save
      redirect_to [:admin, :campaigns], notice: 'Campaign was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /admin/campaigns/1
  # PATCH/PUT /admin/campaigns/1.json
  def update
    @structures = Association.order(name: :asc)

    if @campaign.update(campaign_params)
      redirect_to [:admin, :campaigns], notice: 'Campaign was successfully created.', notice: 'Campaign was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /admin/campaigns/1
  # DELETE /admin/campaigns/1.json
  def destroy
    @campaign.destroy
    respond_to do |format|
      format.html { redirect_to admin_campaigns_url, notice: 'Campaign was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def close_definitly
    @campaign.close_definitly
    redirect_back fallback_location: root_path
  end

  def close_temporarily
    @campaign.close_temporarily
    redirect_back fallback_location: root_path
  end

  def open
    @campaign.opening
    redirect_back fallback_location: root_path
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_campaign
      if params[:id]
        @campaign = Campaign.find(params[:id])
      elsif params[:campaign_id]
        @campaign = Campaign.find(params[:campaign_id])
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def campaign_params
      params[:campaign].permit(:structure_id, :name, :description, :code, :start_at, :end_at, :is_public,
                                motions_attributes: [:id, :name, :kind, :order, :_destroy],
                                voting_tables_attributes: [:id, :position, :voting, :as_member, :_destroy])
    end
end
