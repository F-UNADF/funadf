class ApplicationController < ActionController::Base
  protect_from_forgery prepend: true, with: :exception

  include PublicActivity::StoreController
end
