class StructuresController < ApplicationController
  before_filter :set_structure

  def show
  end

  def edit
  end

  def update
    if @structure.update(structure_params)
      redirect_to @structure, flash:{success: 'Votre structure a été mise à jour.'}
     else
      render :edit
    end
  end


  private
    def set_structure
      @structure = Structure.find params[:id]
    end

    def structure_params
      params[:structure].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email)
    end
end
