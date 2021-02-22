class Structures::HasMembershipsController < ApplicationController
  before_filter :set_structure

  def index
    @members = @structure.members.paginate(:page => params[:page])

    respond_to do |format|
      format.html
      format.pdf do
        @members = @structure.members
        render pdf: "emargement_#{@structure.name}",
           encoding: 'utf8'
      end
    end
  end

  def create

    klass = Object.const_get params[:member_type]
    @member = klass.find params[:member_id]


    @member.add_role :member, @structure

    redirect_to :back, alert: 'Membre ajouté'
  end

  def destroy

    @structure = Structure.find params[:structure_id]

    klass = Object.const_get params[:member_type]

    @member = klass.find params[:member_id]

    #current_role
    current_role = @member.my_roles.where(resource_id: params[:structure_id]).first.name

    @member.remove_role current_role.to_sym, @structure

    redirect_to :back, alert: 'Membre supprimé'
  end

  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

end