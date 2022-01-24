class Me::EventsController < MeController


  def show
    @event = Event.find params[:id]

    respond_to do |format|
      format.js
    end
  end


end