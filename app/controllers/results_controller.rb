class ResultsController < ApplicationController

  def index

    presidences = current_user.get_presidences.pluck(:resource_id)

    electors = Elector.where(resource_id: presidences).pluck(:structure_id)

    @campaigns = Campaign.where(structure_id: electors, state: :closed).order(start_at: :desc).paginate(:page => params[:page])
  end

  def show
    @campaign = Campaign.find params[:id]
  end
end
