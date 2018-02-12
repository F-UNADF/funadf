class Admin::StructuresController < ApplicationController
  before_action :set_structure, only: :destroy

  # GET /admin/structures
  # GET /admin/structures.json
  def index
    @structures = Structure.all
  end


  # GET /admin/structures/new
  def new
    @structure = Structure.new
  end

  # DELETE /admin/structures/1
  # DELETE /admin/structures/1.json
  def destroy
    @structure.destroy
    respond_to do |format|
      format.html { redirect_to admin_structures_url, notice: 'Structure was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_structure
      @structure = Structure.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def structure_params
      params[:structure].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email)
    end
end
