class Intranet::StructureController < IntranetController

  def show
  end

  def edit
  end

  def update
    if @intranet_structure.update(structure_params)
      redirect_to intranet_the_structure_path, flash:{success: 'Votre structure a été mise à jour.'}
     else
      render :edit
    end
  end

  private
    def structure_params
      params[:structure].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :type, :logo)
    end

end