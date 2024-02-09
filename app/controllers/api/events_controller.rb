class Api::EventsController < ApiController
  before_action :set_event, only: [:show, :update, :destroy]

  def index
    events = []
    if @subdomain == 'admin'
      events = Event.joins(:structure).where("end_at > ?", Time.current).order(start_at: :asc)
    elsif @subdomain == 'association'
      # get campaigns of the association of the current user
      # Vérifier si l'utilisateur actuel a des responsabilités d'association
      responsibilities_ids = current_user.associations_responsabilities.pluck(:id)

      # Si l'utilisateur a des responsabilités d'association, récupérer les événements à venir associés à ces responsabilités
      if responsibilities_ids.present?
        events = Event.joins(:structure).where("end_at > ?", Time.current)
                              .where(structure_id: responsibilities_ids)
                              .order(id: :desc)
      end
    elsif @subdomain.present? && !@structure.nil?
      events = @structure.events.joins(:structure).where("end_at > ?", Time.current).order(start_at: :asc)
    end

    render json: { events: events }, include: ['category', 'structure']
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
    event = Event.new(event_params)
    category = Category.find_or_create_by(name: params[:event][:category], kind: 'event')
    event.category_id = category.id 
    if event.save
      params[:files]&.each do |file|
        event.files.attach(file)
      end

      params[:event][:accesses].each do |level|
        event.accesses.find_or_create_by(level: level[1], can_access: true)
      end
      render json: { status: 200, event: event }, include: ['category', 'structure']
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
      render json: { status: 200, event: @event }, include: ['category', 'structure']
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