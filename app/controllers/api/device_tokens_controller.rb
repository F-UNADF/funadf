# app/controllers/api/device_tokens_controller.rb
class Api::DeviceTokensController < ApiController
  protect_from_forgery with: :null_session

  def create
    token = params[:token]
    platform = params[:platform]
    user_id = params[:user_id]

    dt = DeviceToken.find_or_initialize_by(token: token)
    dt.platform = platform
    dt.user_id = user_id
    if dt.save
      render json: { status: 'ok' }
    else
      render json: { status: 'error', errors: dt.errors.full_messages }, status: 422
    end
  end
end