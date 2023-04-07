class Structures::HasMembershipsController < ApplicationController
  before_action :set_structure

  def index
    @members = @structure.members.paginate(:page => params[:page], per_page: 200)

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

    redirect_back fallback_location: root_path, alert: 'Membre ajouté'
  end

  def destroy
    @structure = Structure.find params[:structure_id]

    klass = Object.const_get params[:member_type]

    @member = klass.find params[:member_id]

    @member.memberships.where(structure_id: @structure.id).delete_all

    redirect_back fallback_location: root_path, alert: 'Membre supprimé'
  end

  def update
    membership = Membership.where(structure: @structure, member_id: params[:resource_id], member_type: params[:resource_type]).first

    membership.can_vote = params[:can_vote]
    if membership.save
      render json: {updated: :ok}, status: 200
    else
      render json: {updated: :nok}, status: 200
    end
  end

  def reason
    membership = Membership.where(structure: @structure, member_id: params[:resource_id], member_type: params[:resource_type]).first

    membership.reason = params[:reason]
    if membership.save
      render json: {updated: :ok}, status: 200
    else
      render json: {updated: :nok}, status: 200
    end
  end

  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

end