class Api::CurrentUserController < ApiController
  def show
    @user          = current_user
    @original_user = nil
    unless session[:original_user].nil? || @user == api_user
      @original_user = User.find_by(id: session[:original_user])
    end

    user_with_custom_attribute = @user.as_json
    user_with_custom_attribute[:level] = @user.level

    respond_to do |format|
      format.json { render json: { user: user_with_custom_attribute, original_user: @original_user, roles: @user.application_roles, region: @user.regions_responsabilities.first } }
    end
  end

  # « Se connecter en tant que » : réservé aux admins et modérateurs ;
  # un modérateur ne peut pas prendre l'identité d'un admin.
  def switch
    # api_user : l'utilisateur authentifié par son jeton, pas l'identité usurpée.
    return forbidden! unless api_user.can_switch?

    if session[:connect_as].nil? && session[:original_user].nil?
      user = User.find(params[:id])
      return forbidden! if user.is_admin? && !api_user.is_admin?

      original_user           = api_user
      session[:original_user] = api_user.id
      session[:connect_as]    = user.id

      render json: { status: 200, current_user: user, original_user: original_user, redirect_to: me_root_path }
    else
      render json: { status: 403, message: 'Already switched' }
    end
  end

  def switch_back
    session[:connect_as]    = nil
    session[:original_user] = nil

    render json: { status: 200, current_user: current_user, redirect_to: admin_users_path }
  end
end
