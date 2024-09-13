class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]
  skip_before_action :verify_authenticity_token

  layout :set_layout

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
    user = User.find_by_email(params[:email])
    if user && user.valid_password?(params[:password])
      # Fin du l'air Devise en Session, on passe en Tokenization
      # On cherche le dernier token actif 
      current_api_token = ApiToken.where(active: true).find_by_user_id(user.id)
      # Si on en trouve pas, on en crée un
      if current_api_token.nil?
        current_api_token = ApiToken.create(user: user)
      end

      render json: { user: user, token: current_api_token.token, redirect: root_url }, status: :created
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  private
    def set_layout
      'layouts/devise'
    end
end
