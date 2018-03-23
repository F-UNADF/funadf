class StructuresController < ApplicationController
  before_filter :set_structure, except: [:index, :new, :create]

  def index
    @q = Structure.ransack(params[:q])
    @structures = @q.result(distinct: true).paginate(:page => params[:page])
  end

  def show
  end

  def new
    @structure = Structure.new
  end

  def create
    @structure = Structure.new structure_params
    if @structure.save
      redirect_to [@structure.becomes(Structure), :has_memberships], notice: "Structure créée"
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @structure.update(structure_params)
      redirect_to [@structure.becomes(Structure), :has_memberships], flash:{success: 'Votre structure a été mise à jour.'}
     else
      render :edit
    end
  end


  private
    def set_structure
      @structure = Structure.find params[:id]
    end

    def structure_params
      params[:structure].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :type)
    end
end
