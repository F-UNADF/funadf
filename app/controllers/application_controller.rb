class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # skip_before_action :verify_authenticity_token
  protect_from_forgery prepend: true, with: :exception

  before_action :get_original_user, :set_subdomain

  layout :set_layout

  include PublicActivity::StoreController

  def get_original_user
    @original_user_scope_identifier = session[:original_user_scope_identifier]
  end

  def set_subdomain
    @subdomain = ""
    unless request.subdomain.blank?
      @subdomain = request.subdomain
    end
  end

  private
    def set_layout
      folder = 'votes/'
      module_name = self.class.to_s.split("::").first

      sub = request.subdomain.sub! ".recette", ""

      if module_name.eql?("Devise")
        return "devise/layouts"
      else
        if sub && sub != ''
          case sub
          when 'admin'
            folder = 'admin/'
          when 'me'
            folder = 'me/'
          else
            folder = 'intranet/'
          end
        end

        return "#{folder}layouts/application"
      end

    end

    def after_sign_in_path_for(resource)
      uadpif = Structure.where(name: 'UADPIF').first
      if(resource.structures.include?(uadpif))
        root_url(subdomain: 'me')
      else
        root_url
      end
    end

end
