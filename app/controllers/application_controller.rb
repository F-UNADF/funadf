class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # skip_before_action :verify_authenticity_token
  protect_from_forgery prepend: true, with: :exception

  before_action :set_subdomain

  include PublicActivity::StoreController

  def set_subdomain
    @subdomain = ""
    unless request.subdomain.blank?
      @subdomain = request.subdomain
    end
  end

  def devise_current_user
    @devise_current_user ||= warden.authenticate(scope: :user)
  end

  def current_user
    if !session[:connect_as].nil?
      User.find(session[:connect_as])
    else
      devise_current_user
    end
  end

  def original_user
    if session[:connect_as].nil?
      nil
    else
      devise_current_user
    end
  end


  private

    def after_sign_in_path_for(resource)
      uadpif = Structure.where(name: 'UADPIF').first
      if(resource.structures.include?(uadpif))
        root_url(subdomain: 'me')
      else
        root_url
      end
    end

end
