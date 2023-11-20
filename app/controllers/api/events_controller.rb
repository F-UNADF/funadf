class Api::EventsController < ApiController
  before_action :set_event, only: [:show, :update, :destroy]

  def index
    if @structure.nil?
      events = Event.where("end_at > ?", Time.current).order(id: :desc)
    else
      events = @structure.events.where("end_at > ?", Time.current).order(id: :desc)
    end
    render json: { events: events }
  end

  def show
    files_data = @event.files.map do |file|
      {
        id:   file.id,
        name: file.filename.to_s,
        url:  url_for(file)
      }
    end
    render json: { event: @event, files: files_data, accesses: @event.accesses.pluck(:level) }
  end

  def create
    event             = Event.new(event_params)
    category          = Category.find_or_create_by(name: params[:event][:category], kind: 'event')
    event.category_id = category.id

    if @structure.present?
      event.structure_id = @structure.id
    end

    if event.save
      params[:files]&.each do |file|
        event.files.attach(file)
      end

      params[:event][:accesses].each do |level|
        event.accesses.find_or_create_by(level: level[1], can_access: true)
      end
      render json: { status: 200, event: event }
    else
      render json: { status: 422, errors: event.errors }
    end
  end

  def update
    category           = Category.find_or_create_by(name: params[:event][:category], kind: 'event')
    @event.category_id = category.id

    if @structure.present?
      @event.structure_id = @structure.id
    end

    params[:files]&.each do |file|
      @event.files.attach(file)
    end

    params[:event][:accesses].each do |level|
      @event.accesses.find_or_create_by(level: level[1], can_access: true)
    end
    @event.accesses.where.not(level: params[:event][:accesses].values).destroy_all

    if @event.update(event_params)
      render json: { status: 200, event: @event }
    else
      render json: { status: 422, errors: @event.errors }
    end
  end

  def destroy
    @event.destroy
    render json: { status: 200 }
  end

  private

  def set_event
    @event = Event.find(params[:id])
  end

  def event_params
    params[:event].permit(:title, :structure_id, :start_at, :end_at, :description)
  end

end