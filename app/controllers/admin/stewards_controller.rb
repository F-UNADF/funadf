class Admin::StewardsController < AdminController

  def new
    @user = User.find(params[:user_id])
    if @user.add_role :steward
      redirect_to edit_admin_user_path(@user), alert: 'Utilisateur promu intendant'
    else
      render 'users/edit'
    end
  end

  def destroy
    @user = User.find(params[:user_id])
    if @user.remove_role :steward
      redirect_to edit_admin_user_path(@user), alert: 'Intendant supprimé'
    else
      render 'users/edit'
    end
  end


end