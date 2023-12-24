class Api::SessionsController < ApiController

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