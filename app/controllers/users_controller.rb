class UsersController < ApplicationController

  before_filter :check_current_user

  def show
    @user = User.find params[:id]
  end

  private
    def check_current_user
      if current_user.id == params[:id]
        redirect_to me_path
      end
    end


end