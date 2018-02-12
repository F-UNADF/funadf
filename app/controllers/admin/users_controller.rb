class Admin::UsersController < AdminController

  def index
    @users = User.order(:id)
  end

  def edit
    @user = User.find params[:id]
  end

  private
    def user_params
      params[:user].permit(:firstname, :lastname, :avatar, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email)
    end


end