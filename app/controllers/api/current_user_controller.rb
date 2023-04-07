class Api::CurrentUserController < ApplicationController
  def show
    @user = current_user

    respond_to do |format|
      format.json { render json: @user }
    end
  end
end
