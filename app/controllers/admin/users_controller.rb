class Admin::UsersController < AdminController

  def index
    @q = User.ransack(params[:q])

    if params[:page].blank?
      params[:page] = session[:user_page]
    end

    @users = @q.result(distinct: true).paginate(:page => params[:page], per_page: 50)
    session[:user_page] = params[:page] if params[:page]
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
      if params[:user][:password].blank?
        params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2,
                          :email, :level, :birthdate)
      else
        params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2,
                          :email, :level, :birthdate, :password, :password_confirmation)
      end
    end


end