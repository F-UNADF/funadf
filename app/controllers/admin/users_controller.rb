class Admin::UsersController < AdminController

  def index
    @users = User.order(:id).paginate(:page => params[:page])
  end

  def edit
    @user = User.find params[:id]
  end

  def update
    @user = User.find params[:id]
    if @user.update(user_params)
      redirect_to [:admin, :users], flash:{success: 'L\'utilisateur a été mis à jour.'}
     else
      render :edit
    end
  end

  def destroy
    @user = User.find params[:id]
    @user.destroy
    redirect_to [:admin, :users], flash:{success: 'Utilisateur supprimé'}
  end

  private
    def user_params
      params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2,
                          :email, :level, :birthdate)
    end


end