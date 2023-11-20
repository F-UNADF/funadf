class Me::ProfileController < MeController

  def show
    @me = current_user

    respond_to do |format|
      format.html
      format.json {
        render json: @me
      }
    end
  end


end