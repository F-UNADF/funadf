class Admin::AdminsController < AdminController

  def new
    @user = User.find(params[:user_id])
    if @user.add_role :admin
      redirect_to edit_admin_user_path(@user), alert: 'Utilisateur promu administrateur'
    else
      render 'users/edit'
    end
  end

  def destroy
    @user = User.find(params[:user_id])
    if @user.remove_role :admin
      redirect_to edit_admin_user_path(@user), alert: 'Administrateur supprimé'
    else
      render 'users/edit'
    end
  end


end