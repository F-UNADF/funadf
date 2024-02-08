class AdminController < ApplicationController
  layout 'admin/layouts/vuejs'

  before_action :user_is_admin?

  private

  def user_is_admin?
    if current_user.has_role? [:admin, :moderator]
      return true
    end
    redirect_to root_url(subdomain: 'me'), alert: 'Vous n\'êtes pas autorisé à consulter cette page'
  end
end
