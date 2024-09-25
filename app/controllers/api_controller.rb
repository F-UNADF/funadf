class ApiController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found

  before_action :authenticate, :set_subdomain

  attr_reader :current_user

  private

  def current_user
    if session[:connect_as].nil?
      @current_user
    else
      User.find(session[:connect_as])
    end
  end

  def set_subdomain
    @subdomain = ''

    referer = request.referer
    return unless referer

    # Extraire le sous-domaine du referer (si nécessaire)
    uri = URI.parse(referer)
    referer_subdomain = uri.host.split('.').first

    # Mettre à jour le sous-domaine dans la requête en fonction du referer
    if referer_subdomain.present?
      # Par exemple, changer la requête en fonction du sous-domaine du referer
      @subdomain = referer_subdomain
    end
  end

  def authenticate
    authenticate_user_with_token || handle_bad_authentication
  end

  def authenticate_user_with_token
    authenticate_with_http_token do |token, options|
      current_api_token = ApiToken.where(active: true).find_by_token(token)
      @current_user = current_api_token&.user
    end
  end

  def handle_bad_authentication
    render json: { message: "Bad credentials" }, status: :unauthorized
  end

  def handle_not_found
    render json: { message: "Record not found" }, status: :not_found
  end
end