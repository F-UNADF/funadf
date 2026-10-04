# app/controllers/api/device_tokens_controller.rb
class Api::DeviceTokensController < ApiController
  protect_from_forgery with: :null_session

  # Le jeton est toujours rattaché à l'utilisateur connecté : un éventuel
  # `user_id` envoyé par d'anciens clients est ignoré.
  def create
    token = params[:token]
    platform = params[:platform]

    dt = DeviceToken.find_or_initialize_by(token: token)
    dt.platform = platform
    dt.user_id = current_user.id
    if dt.save
      render json: { status: 'ok' }
    else
      render json: { status: 'error', errors: dt.errors.full_messages }, status: 422
    end
  end

  # DELETE /api/device_tokens/:id?token=<jeton FCM>
  # L'app mobile désactive les notifications de l'appareil ou se déconnecte.
  # Le jeton FCM est passé en paramètre `token` (sinon dans `:id`, URL-encodé).
  # Idempotent : 204 même si le jeton est déjà inconnu ; limité à l'utilisateur connecté.
  def destroy
    token = params[:token].presence || params[:id]
    DeviceToken.where(token: token, user_id: current_user.id).destroy_all
    head :no_content
  end
end