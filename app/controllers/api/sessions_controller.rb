class Api::SessionsController < ApiController
  skip_before_action :authenticate, only: [:login, :connect_with_google]

  def login
    user = User.find_by(email: params[:email])

    if user && user.valid_password?(params[:password])
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

  def connect_with_google
    user = User.find_by(email: params[:email])
    if user && user.persisted?
      sign_in user
      render json: { user: user, token: user.authentication_token, redirect: root_url }, status: :created
    else
      render json: { user: user, errors: user.errors.full_messages }, status: 422
    end
  end

end