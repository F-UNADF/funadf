class AdminController < ApplicationController

  before_action :user_is_admin?

  private
    def user_is_admin?
      unless current_user.has_role? [:admin, :moderator]
        redirect_to root_url(subdomain: ''), alert: 'Vous n\'êtes pas autorisé à consulter cette page'
      end
    end

end