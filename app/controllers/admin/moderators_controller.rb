class Admin::ModeratorsController < AdminController

  def new
    @user = User.find(params[:user_id])
    if @user.add_role :moderator
      redirect_to edit_admin_user_path(@user), alert: 'Utilisateur promu modérateur'
    else
      render 'users/edit'
    end
  end

  def destroy
    @user = User.find(params[:user_id])
    if @user.remove_role :moderator
      redirect_to edit_admin_user_path(@user), alert: 'Modérateur supprimé'
    else
      render 'users/edit'
    end
  end


end