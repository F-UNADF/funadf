class Me::StructuresController < MeController

  before_action :set_structure, except: [:index, :new, :create]


  def show
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
      params[:structure].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :type, :logo)
    end
end
