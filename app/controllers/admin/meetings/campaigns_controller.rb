class Admin::Meetings::CampaignsController < ApplicationController

  before_filter :set_meeting

  def index
    @q = @meeting.campaigns.ransack(params[:q])
    @campaigns = @q.result(distinct: true).paginate(:page => params[:page])
  end


  private
    def set_meeting
      @meeting = Meeting.find(params[:meeting_id])
    end


end
