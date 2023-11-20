class MeController < ApplicationController
  layout 'me/layouts/vuejs'
  before_action :get_events

  def get_events
    @my_structures = current_user.structures
    @events = Event.where(structure_id: @my_structures.pluck(:id)).where('start_at >= ?', DateTime.now).joins(:accesses).where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level).order(start_at: :asc).limit(5)
  end
end