class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  skip_before_filter :verify_authenticity_token
  protect_from_forgery prepend: true, with: :exception

  before_filter :get_original_user

  def get_original_user
    @original_user_scope_identifier = session[:original_user_scope_identifier]
  end

end
