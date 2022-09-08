# app/controllers/v1/users_controller.rb
module V1
  class UsersController < ApplicationController
    respond_to :json
    skip_before_action :verify_authenticity_token


    # POST /users/sign_in
    def show
      user = User.find_by(authentication_token: params[:token])
      render json: {user: user.to_json, church: user.current_church}
    end
  end
end
