class Api::SessionsController < ApiController
  skip_before_action :authenticate, only: [:login]

  def login
    user = User.find_by(email: params[:email])

    if user && user.valid_password?(params[:password]) && user.active_for_authentication?
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

end