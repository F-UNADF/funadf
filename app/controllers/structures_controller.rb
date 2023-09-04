class StructuresController < ApplicationController

  before_action :set_structure, except: [:index, :new, :create]

  def index
    @q = Structure.select("structures.id AS id,
                   structures.name AS name,
                   structures.town AS town,
                    structures.type AS type")
                  .order(type: :asc, town: :asc)

    if !current_user.has_role? [:admin, :steward]
      @q = @q.joins(:memberships).where("memberships.member_id = ? AND memberships.member_type = 'User'", current_user.id)
    end

    @q = @q.ransack(params[:q])
    @structures = @q.result(distinct: true, ).paginate(:page => params[:page], per_page: 50)

    respond_to do |format|
      format.html
      format.json {
        type = params['type']
        q = params['query']
        @structures = Structure.where(type: type).where('name LIKE ? OR town LIKE ?', "%#{q}%", "%#{q}%")
        render json: @structures
      }
    end
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
      redirect_to [@structure.becomes(Structure), :has_memberships], flash: { success: 'Votre structure a été mise à jour.' }
    else
      render :edit
    end
  end

  def destroy
    @structure.destroy

    redirect_back fallback_location: root_path, flash: { success: 'Structure supprimée' }
  end

  private

  def set_structure
    @structure = Structure.find params[:id]
  end

  def structure_params
    params[:structure].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :type, :logo)
  end
end
