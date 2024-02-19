class Api::MeetingsController < ApiController

  def index
    meetings = Meeting.all
    render json: { meetings: meetings }
  end

  def show
    meeting = Meeting.find(params[:id])
    render json: { meeting: meeting, attendees: meeting.users}
  end

  def create
    meeting = Meeting.new(meeting_params)
    if meeting.save
      render json: { meeting: meeting }
    else
      render json: { errors: meeting.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    meeting = Meeting.find(params[:id])
    if meeting.update(meeting_params)
      render json: { meeting: meeting }
    else
      render json: { errors: meeting.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    meeting = Meeting.find(params[:id])
    meeting.destroy
    render json: { message: 'Meeting deleted' }
  end

  def add_attendees
    meeting = Meeting.find(params[:id])

    params[:attendees].each do |attendee|
      meeting.attendees.find_or_create_by(user_id: attendee).save
    end

    render json: { meeting: meeting, attendees: meeting.users }
  end

  private

  def meeting_params
    params.require(:meeting).permit(:name, :begin_at, :end_at, :description)
  end

end