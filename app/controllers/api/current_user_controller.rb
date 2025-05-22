class Api::CurrentUserController < ApiController
  def show
    @user          = current_user
    @original_user = nil
    unless session[:original_user].nil?
      @original_user= User.find(session[:original_user])
    end

    user_with_custom_attribute = @user.as_json
    user_with_custom_attribute[:level] = @user.level

    respond_to do |format|
      format.json { render json: { user: user_with_custom_attribute, original_user: @original_user, roles: @user.application_roles, region: @user.regions_responsabilities.first } }
    end
  end

  def switch
    if session[:connect_as].nil? && session[:original_user].nil?
      session[:original_user] = current_user.id
      original_user           = current_user
      session[:connect_as]    = params[:id]
      user                    = User.find(params[:id])

      render json: { status: 200, current_user: current_user, original_user: original_user, redirect_to: root_url(subdomain: nil) }
    else
      render json: { status: 403, message: 'Already switched' }
    end
  end

  def switch_back
    session[:connect_as]    = nil
    session[:original_user] = nil

    render json: { status: 200, current_user: current_user, redirect_to: admin_users_url(subdomain: :admin) }
  end

  def get_google_link
    render json: { google_link: user_google_oauth2_omniauth_authorize_path }
  end
end
