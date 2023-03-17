class Structures::IsMembershipsController < ApplicationController
  before_action :set_structure

  def index
    @is_members = Membership.select("structures.id AS friendly_id,
                                    structures.name AS name,
                                    structures.email AS email,
                                    structures.phone_1 AS phone_1,
                                    roles.name AS role")
                            .joins(:structure, :role)
                            .where(member_id: @structure.id, member_type: 'Structure')
  end


  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

end