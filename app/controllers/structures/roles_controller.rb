class Structures::RolesController < ApplicationController

  def edit
    @structure = Structure.find params[:structure_id]
    klass = Object.const_get params[:resource_type]
    @resource = klass.find params[:resource_id]

    render layout: false
  end

  def update
    @structure = Structure.find params[:structure_id]
    klass = Object.const_get params[:resource_type]
    @resource = klass.find params[:resource_id]

    new_role = params[:role][:role]
    old_role = @structure.get_role(@resource)

    @resource.add_role new_role, @structure
    @resource.remove_role old_role, @structure

    redirect_to [@structure.becomes(Structure), :has_memberships], alert: "Role mis à jours"
  end

end