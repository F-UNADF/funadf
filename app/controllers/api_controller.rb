class ApiController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :check_subdomain

  def check_subdomain
    subdomain = request.subdomain
    if subdomain.present? && subdomain != 'admin'
      @intranet = Intranet.find_by(subdomain: subdomain)
      @structure = @intranet.structure
      if @intranet.nil?
        render json: { error: 'Intranet not found' }, status: 404
      end
    end
  end

end