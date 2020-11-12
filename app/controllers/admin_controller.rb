class AdminController < ApplicationController

  before_filter :user_is_admin?

  private
    def user_is_admin?
      unless current_user.has_role? :admin
        redirect_to root_url, alert: 'Vous n\'êtes pas autorisé à consulter cette page'
      end
    end

end