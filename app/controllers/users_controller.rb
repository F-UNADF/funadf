class UsersController < ApplicationController

  before_filter :check_current_user

  def index
    @q = params['search']

    @users = User.where('firstname LIKE ? OR lastname LIKE ?', "%#{@q}%", "%#{@q}%").order(:lastname)

    respond_to do |format|
      format.json {
        render json: @users
      }
    end
  end

  def show
    @user = User.find params[:id]
    @structures = @user.structures
  end

  private
    def check_current_user
      if current_user.id == params[:id]
        redirect_to me_path
      end
    end


end