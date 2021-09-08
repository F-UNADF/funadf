class Admin::UsersController < AdminController

  def index
    @q = User.order(lastname: :asc).ransack(params[:q])

    if params[:page].blank?
      params[:page] = session[:user_page]
    end

    @users = @q.result(distinct: true).paginate(:page => params[:page], per_page: 50)
    session[:user_page] = params[:page] if params[:page]
  end

  def show
    @user = User.find params[:id]
    @structures = @user.structures
  end

  def edit
    @user = User.find params[:id]
  end

  def update
    @user = User.find params[:id]
    @user.reset_password_token = Time.now

    if @user.update!(user_params)
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

  def enable
    @user = User.find params[:user_id]
    @user.disabled = false
    @user.save

    redirect_to :back, flash:{success: 'Utilisateur mis a jour'}
  end
  def disable
    @user = User.find params[:user_id]
    @user.disabled = true
    @user.save

    redirect_to :back, flash:{success: 'Utilisateur mis a jour'}
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