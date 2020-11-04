class ResultsController < ApplicationController

  def index

    presidences = current_user.get_prez.pluck(:resource_id)

    electors = Elector.where('resource_id = ? OR resource_id = ?', presidences, current_user.id).pluck(:structure_id)

    @campaigns = Campaign.where(structure_id: electors, state: :closed).order(start_at: :desc).paginate(:page => params[:page])
  end

  def show
    @campaign = Campaign.find params[:id]
  end
end
