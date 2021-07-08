class Admin::IntranetsController < AdminController
  before_action :set_campaign, only: [:edit, :update, :destroy]

  def index
    @intranets = Intranet.all
    @intranet = Intranet.new
  end


  # GET /admin/campaigns/1/edit
  def edit
    render :index
  end

  # POST /admin/campaigns
  # POST /admin/campaigns.json
  def create
    @intranet = Intranet.new(intranet_params)

    if @intranet.save
      redirect_to [:admin, :intranets], notice: 'Intranet créé'
    else
      @intranets = Intranet.all
      render :index
    end
  end

  # PATCH/PUT /admin/campaigns/1
  # PATCH/PUT /admin/campaigns/1.json
  def update
    if @intranet.update(intranet_params)
      redirect_to [:admin, :intranets], notice: 'Intranet mis a jour.'
    else
      @intranets = Intranet.all
      render :index
    end
  end

  # DELETE /admin/campaigns/1
  # DELETE /admin/campaigns/1.json
  def destroy
    @intranet.destroy
    redirect_to [:admin, :intranets], notice: 'Intranet supprimé.'
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_intranet
      @intranet = Intranet.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def intranet_params
      params[:intranet].permit(:subdomain, :structure_id)
    end
end
