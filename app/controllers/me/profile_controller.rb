class Me::ProfileController < MeController


  def show
    @me = current_user
  end


end