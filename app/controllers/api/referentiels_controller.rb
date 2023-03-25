class Api::ReferentielsController < ApplicationController

  def show
    referentiel = params[:referentiel]
    result = {}
    case referentiel
    when 'users'
      levels = User.get_levels
      whatFees = Fee.pluck(:what).uniq
      churches = Church.select('id AS id, CONCAT(name, "(", town, ")") AS name').order(:name)
      associations = Association.select('id AS id, name AS name').order(:name)
      functions = User.get_functions
      responsabilities = User.get_responsabilities
      result[:levels] = levels
      result[:whatFees] = whatFees
      result[:churches] = churches
      result[:functions] = functions
      result[:responsabilities] = responsabilities
      result[:associations] = associations
    else
      result[:error] = "Invalid referentiel #{referentiel}"
    end

    render json: result
  end
end
