class Admin::MeetingsController < ApplicationController

  def index
    @q = Meeting.order(id: :desc).ransack(params[:q])
    @meetings = @q.result(distinct: true).paginate(:page => params[:page])
  end

  def new
    @meeting = Meeting.new
  end

  def create
    @meeting = Meeting.create(meeting_params)
    if @meeting.save
      redirect_to [:admin, :meetings], notice: "Congrès créée"
    else
      render :new
    end
  end



  def destroy
    @meeting = Meeting.find params[:id]
    @meeting.destroy
    redirect_to [:admin, :meetings], flash:{success: 'Congrès supprimé'}
  end

  private
    def meeting_params
      params[:meeting].permit(:name, :begin_at, :end_at)
    end

end
