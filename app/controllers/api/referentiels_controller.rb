class Api::ReferentielsController < ApplicationController

  def show
    referentiel = params[:referentiel]
    result = {}
    case referentiel
    when 'users'
      levels = User.get_levels
      result[:levels] = levels
    else
      result[:error] = "Invalid referentiel #{referentiel}"
    end

    render json: result
  end
end
