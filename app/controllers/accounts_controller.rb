class AccountsController < ApplicationController

  before_filter :set_user

  def show
    @structures = current_user.structures
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to me_url, flash:{success: 'Votre compte a été mis à jour.'}
     else
      render :edit
    end
  end

  private
    def set_user
      @user = current_user
    end

    def user_params
      if params[:user][:password].blank? && params[:user][:password_confirmation].blank?
        params[:user].delete(:password)
        params[:user].delete(:password_confirmation)
      end
      params[:user].permit(:firstname, :lastname, :avatar, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :password, :password_confirmation, :birthdate)
    end

end
