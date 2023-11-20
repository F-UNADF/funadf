class Intranet::CategoriesController < IntranetController

  def index
    @categories = @intranet_structure.categories.where(kind: :event)
    @category = Category.new
  end

  def create
    @category = @intranet_structure.categories.build(category_params)

    if @category.save
      redirect_back fallback_location: root_path, flash:{success: 'Catégorie ajoutée.'}
    else
      @categories = @intranet_structure.categories.where(kind: :event)
      render :index
    end
  end

  private

    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params.required(:category).permit(:name, :color, :kind, :structure_id)
    end

end
