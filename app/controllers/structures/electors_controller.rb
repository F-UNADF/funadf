class Structures::ElectorsController < ApplicationController
  before_filter :set_structure

  def update
    @elector = @structure.electors.find_by(resource_id: params[:resource_id], resource_type: params[:resource_type])


    @elector.can_vote = params[:can_vote]

    @elector.save
  end

  def update
    @elector = Elector.find_or_create_by(structure: @structure, resource_id: params[:resource_id], resource_type: params[:resource_type])

    if @elector.update(elector_params)
      respond_to do |format|
        format.js
        format.html{
          redirect_to [@structure.becomes(Structure), :has_memberships], alert: 'Electeur mis à jours'
        }
      end
    else
      respond_to do |format|
        format.js
        format.html{
          render :edit
        }
      end
    end
  end

  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

    def elector_params
      params[:elector].permit(:note, :can_vote)
    end
end