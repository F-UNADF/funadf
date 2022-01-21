class MeController < ApplicationController

  before_action :get_events

  def get_events
    @my_structures = current_user.structures
    @events = Event.where(structure_id: @my_structures.pluck(:id)).where('start_at >= ?', DateTime.now).order(start_at: :desc).limit(5)
  end
end