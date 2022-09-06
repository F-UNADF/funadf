# app/controllers/v1/custom_devise/sessions_controller.rb
module V1
  module CustomDevise
    class SessionsController < Devise::SessionsController
      respond_to :json
      protect_from_forgery except: [:create, :destroy]

      acts_as_token_authentication_handler_for User, fallback_to_devise: false
      skip_before_action :verify_authenticity_token


      # POST /users/sign_in
      def create
        allow_params_authentication!

        self.resource = warden.authenticate!(scope: :user)

        reset_token resource
        render json: resource.authentication_token
      end


      # DELETE /users/sign_out
      def destroy
        warden.authenticate!
        reset_token current_user
      end

      private

      def sign_in_params
        params.fetch(:user).permit([:password, :email])
      end

      def reset_token(resource)
        resource.authentication_token = nil
        resource.save!
      end
    end
  end
end
