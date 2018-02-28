class Structures::HasMembershipsController < ApplicationController
  before_filter :set_structure

  def index
    @members = @structure.members
  end

  def create
    @membership = @structure.has_memberships.build(is_memberable_id: params[:member_id], is_memberable_type: params[:member_type], kind: :member)
    puts "@"*10
    if @membership.save
      redirect_to [@structure, :has_memberships], alert: 'Structure ajoutée'
    else
      redirect_to [@structure, :has_memberships], alert: 'Structure non ajoutée'
    end
  end

  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

end