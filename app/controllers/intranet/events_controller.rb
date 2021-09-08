class Intranet::EventsController < IntranetController


  def index

    respond_to do |format|
      format.html
      format.json {
        @events = @intranet_structure.events.where(category: params[:category]).where('start_at BETWEEN ? AND ?', params[:start], params[:end])
      }
    end

  end

  def show
    @event = Event.find params[:id]
    respond_to do |format|
      format.js
    end
  end

  def new
    @event = @intranet_structure.events.build(start_at: params[:start_at], end_at: params[:end_at])

    respond_to do |format|
      format.js
      format.html
    end
  end

  def create
    @event = @intranet_structure.events.build(event_params)

    if @event.save
      redirect_to :back, flash:{success: 'Evenement ajouté.'}
    else
      render :new
    end
  end


  def edit
    @event = Event.find params[:id]
    respond_to do |format|
      format.js
    end
  end


  def update
    @event = Event.find params[:id]

    @event.update(event_params)
    respond_to do |format|
      format.js
      format.html{
        redirect_to :back, flash:{success: 'Evenement mis à jour.'}
      }
    end
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def event_params
      params.required(:event).permit(:title, :description, :category, :start_at, :end_at)
    end


end