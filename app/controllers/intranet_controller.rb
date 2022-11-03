class IntranetController < ApplicationController

  before_action :set_intranet_structure, :user_can_access?

  def set_intranet_structure

    sub = request.subdomain.sub! ".recette", ""

    if sub && sub != '' && !sub.match(/admin|me/)
      @intranet = Intranet.find_by subdomain: sub
      unless @intranet
        redirect_to root_url
      end
      @intranet_structure = @intranet.structure
    end
  end

  def user_can_access?
    unless can? :manage, @intranet_structure
      redirect_to root_url(subdomain: 'me'), alert: 'Vous n\'avez pas les niveaux d\'accès nécessaires'
    end
  end

end