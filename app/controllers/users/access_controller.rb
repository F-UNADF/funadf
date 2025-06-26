class Users::AccessController < ApplicationController
  def new
    token = params[:token]
    @user = User.find_by(access_token: token)

    if @user
      sign_in(@user)
    end
    redirect_to authenticated_user_url
  end
end
