class ResultsController < ApplicationController

  def index
    # JE SUIS MEMBRE DIRECT
    structures = current_user.structures.map{ |struc| struc.id}

    # JE SUIS PRESIDENT
    presidences = current_user.get_presidences.map{ |struc| struc.id}




    @campaigns = Campaign.where(structure_id: (structures+presidences), state: :closed).order(start_at: :desc).paginate(:page => params[:page])
  end

  def show
    @campaign = Campaign.find params[:id]
  end
end
