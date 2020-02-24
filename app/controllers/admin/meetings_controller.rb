class Admin::MeetingsController < ApplicationController

  def index
    @q = Meeting.ransack(params[:q])
    @meetings = @q.result(distinct: true).paginate(:page => params[:page])
  end



  def destroy
    @meeting = Meeting.find params[:id]
    @meeting.destroy
    redirect_to [:admin, :meetings], flash:{success: 'Congrès supprimé'}
  end


end
