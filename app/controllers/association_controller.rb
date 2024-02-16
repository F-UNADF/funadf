class AssociationController < ApplicationController
  layout 'association/layouts/vuejs'

  before_action :user_has_responsabilities?

  private

  def user_has_responsabilities?
    if current_user.associations_responsabilities.any?
      return true
    end
    redirect_to root_url(subdomain: 'me'), alert: 'Vous n\'êtes pas autorisé à consulter cette page'
  end
end