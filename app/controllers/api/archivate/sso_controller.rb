class Api::Archivate::SsoController < ApiController
  # validate est appelé de serveur à serveur par Archivate, sans token API.
  skip_before_action :authenticate, only: [:validate]

  def generate
    sso_token = current_user.sso_tokens.create!

    render json: {
      token: sso_token.token,
      expires_at: sso_token.expires_at,
      redirect_url: "#{archivate_sso_url}?token=#{sso_token.token}"
    }, status: :created
  end

  def validate
    sso_token = SsoToken.usable.find_by(token: params[:token])

    if sso_token && sso_token.consume!
      render json: { user: { id: sso_token.user_id, email: sso_token.user.email } }, status: :ok
    else
      render json: { error: 'Invalid or expired SSO token' }, status: :unauthorized
    end
  end

  private

  def archivate_sso_url
    Rails.application.secrets.archivate_sso_url || 'http://localhost:3400/v1/auth/sso'
  end
end
