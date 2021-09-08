class Intranet::UsersController < IntranetController

  before_filter :check_current_user

  def index

    @q = @intranet_structure.users.order(lastname: :asc).ransack(params[:q])

    @users = @q.result(distinct: true).paginate(:page => params[:page], per_page: 50)
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

    if @user.update(user_params)
      redirect_to [:intranet, :users], flash:{success: 'L\'utilisateur a été mis à jour.'}
     else
      render :edit
    end
  end


  private
    def check_current_user
      if current_user.id == params[:id]
        redirect_to me_path
      end
    end

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