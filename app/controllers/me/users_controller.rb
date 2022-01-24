class Me::UsersController < MeController

  before_action :user_is_current_user

  def show
    @user = User.find params[:id]
  end

  private
    def user_is_current_user
      if params[:id].to_i == current_user.id
        redirect_to '/mon-profil'
      end
    end


end