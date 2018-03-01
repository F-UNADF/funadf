class Structures::HasMembershipsController < ApplicationController
  before_filter :set_structure

  def index
    @members = @structure.members
  end

  def create

    klass = Object.const_get params[:member_type]
    @member = klass.find params[:member_id]

    puts "$"*50
    puts @member.inspect

    @member.add_role :member, @structure

    redirect_to :back, alert: 'Membre ajouté'
  end

  private
    def set_structure
      @structure = Structure.find params[:structure_id]
    end

end