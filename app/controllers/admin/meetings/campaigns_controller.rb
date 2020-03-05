class Admin::Meetings::CampaignsController < ApplicationController

  before_filter :set_meeting

  def index
    @q = @meeting.campaigns.ransack(params[:q])
    @campaigns = @q.result(distinct: true).paginate(:page => params[:page])
  end

  def new
    @campaign = @meeting.campaigns.build

    @structures = Association.order(name: :asc)
  end

  def create
    @campaign = @meeting.campaigns.build(campaign_params)
    if @campaign.save
      redirect_to [:admin, @meeting, :campaigns], notice: "Campagne créée"
    else
      @structures = Association.order(name: :asc)
      render :new
    end
  end

  def edit
    @campaign = Campaign.find params[:id]

    @structures = Association.order(name: :asc)
  end

  def update
    @campaign = Campaign.find params[:id]
    if @campaign.update(campaign_params)
      redirect_to [:admin, @meeting, :campaigns], flash:{success: 'Campagne mise à jours.'}
     else
      @structures = Association.order(name: :asc)
      render :edit
    end
  end

  private
    def set_meeting
      @meeting = Meeting.find(params[:meeting_id])
    end


    def campaign_params
      params[:campaign].permit(:manual, :description, :code, :start_at, :end_at, :structure_id, motions_attributes: [:id, :name, :kind, :order, :_destroy])
    end


end
