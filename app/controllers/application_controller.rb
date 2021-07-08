class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # skip_before_filter :verify_authenticity_token
  protect_from_forgery prepend: true, with: :exception

  before_filter :get_original_user, :set_intranet_structure

  layout :set_layout

  def get_original_user
    @original_user_scope_identifier = session[:original_user_scope_identifier]
  end

  private
    def set_layout
      folder = 'votes/'
      if request.subdomain && request.subdomain != ''
        case request.subdomain
        when 'admin'
          folder = 'admin/'
        else
          folder = 'intranet/'
        end
      end
      module_name = self.class.to_s.split("::").first
      mod =  (module_name.eql?("Devise") ? "devise" : "application")

      return "#{folder}layouts/#{mod}"

    end

    def set_intranet_structure
      if request.subdomain && request.subdomain != '' && request.subdomain != 'admin'
        @intranet = Intranet.find_by subdomain: request.subdomain
        unless @intranet
          redirect_to root_url
        end
        @intranet_structure = @intranet.structure
      end
    end

end
