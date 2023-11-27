class Api::Me::EventsController < ApiController

  def index
    # set offset to 0 if not present
    offset = params[:offset] || 0
    events = Event.joins(:accesses, :structure)
                  .where(structure_id: current_user.memberships.pluck(:structure_id))
                  .where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level)
                  .where('end_at > ?', Time.now)
                  .order(start_at: :asc)
                  .limit(5)
                  .offset(offset)

    if params[:search].present?
      events = events.where('events.title LIKE ? OR events.description LIKE ?', "%#{params[:search]}%", "%#{params[:search]}%")
    end

    event_with_urls = events.map do |event|
      {
        event:       event,
        images:      event.images.map { |image| url_for image },
        attachments: event.attachments.map { |file| url_for file },
        structure:   event.structure,
      }
    end

    render json: { events: event_with_urls }
  end

end