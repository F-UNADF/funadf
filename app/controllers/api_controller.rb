class ApiController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found

  before_action :authenticate, :set_subdomain

  # Rôles applicatifs : jamais attribuables à travers une structure.
  APPLICATION_ROLES = %w[admin moderator].freeze

  private

  # Utilisateur authentifié par son jeton d'API (jamais l'identité usurpée).
  # Volontairement pas @current_user : quand la vérification CSRF échoue
  # (protect_from_forgery with: :null_session), Devise appelle sign_out_all_scopes,
  # qui remet @current_user à nil.
  attr_reader :api_user

  # Usurpation (« se connecter en tant que ») : uniquement si la session a été
  # ouverte par ce même utilisateur authentifié, et qu'il a toujours le droit d'usurper.
  def current_user
    return api_user if api_user.nil? || session[:connect_as].nil?
    return api_user unless session[:original_user].to_s == api_user.id.to_s && api_user.can_switch?

    @switched_user ||= User.find_by(id: session[:connect_as]) || api_user
  end

  def set_subdomain
    @subdomain = ''

    referer = request.referer
    return unless referer

    uri = URI.parse(referer)
    path = uri.path                      # exemple : "/admin/campaigns"
    first_segment = path.split('/')[1]  # => "admin"

    if first_segment.in?(%w[admin association region])
      @subdomain = first_segment
    end
  end


  def authenticate
    authenticate_user_with_token || handle_bad_authentication
  end

  def authenticate_user_with_token
    authenticate_with_http_token do |token, options|
      current_api_token = ApiToken.where(active: true).find_by_token(token)
      # Jeton d'un compte désactivé : refusé comme un jeton inconnu
      @api_user = current_api_token&.user&.then { |user| user.active_for_authentication? ? user : nil }
    end
  end

  def handle_bad_authentication
    render json: { message: "Bad credentials" }, status: :unauthorized
  end

  def handle_not_found
    render json: { message: "Record not found" }, status: :not_found
  end

  # ---------- Autorisations ----------

  def forbidden!
    render json: { message: "Forbidden" }, status: :forbidden
  end

  def admin?
    current_user.present? && current_user.is_admin?
  end

  def admin_or_moderator?
    admin? || current_user.has_role?(:moderator)
  end

  # Associations et régions dont l'utilisateur est responsable
  # (président, secrétaire, trésorier ou directeur).
  def managed_structure_ids
    @managed_structure_ids ||= (current_user.associations_responsabilities.pluck('structures.id') +
                                current_user.regions_responsabilities.pluck('structures.id')).uniq
  end

  def can_manage_structure?(structure_or_id)
    return true if admin?

    id = structure_or_id.respond_to?(:id) ? structure_or_id.id : structure_or_id
    id.present? && managed_structure_ids.include?(id.to_i)
  end

  def require_admin!
    forbidden! unless admin?
  end

  def require_admin_or_moderator!
    forbidden! unless admin_or_moderator?
  end

  # Espace demandé par la SPA (`domain`) : admin réservé aux admins ;
  # association et région déjà bornées aux responsabilités de l'utilisateur.
  def require_domain_access!
    forbidden! if params[:domain].to_s == 'admin' && !admin?
  end

  # Rôle attribuable dans une structure : un rôle existant, hors rôles applicatifs.
  def structure_role(name)
    return nil if APPLICATION_ROLES.include?(name.to_s)

    Role.find_by(name: name.to_s)
  end
end
