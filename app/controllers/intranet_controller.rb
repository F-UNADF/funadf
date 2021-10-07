class IntranetController < ApplicationController

  before_filter :set_intranet_structure

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