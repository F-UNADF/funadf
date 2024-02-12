# app/controllers/v1/users_controller.rb
module V1
  class UsersController < ApplicationController
    respond_to :json
    skip_before_action :verify_authenticity_token


    # POST /users/sign_in
    def show
      user = User.find_by(authentication_token: params[:token])

      phases           = user.phases.joins('JOIN structures AS church ON church.id = careers.church_id').select('careers.id, careers.start_at, careers.end_at, careers.church_id, CONCAT(church.name, "(", church.town, ")") AS church_name, careers.function').order(:start_at)
      responsabilities = user.responsabilities.joins('JOIN structures AS association ON association.id = careers.association_id').select('careers.id, careers.start_at, careers.end_at, careers.association_id, association.name, careers.function').order(:start_at)

      render json: {
        user: user.attributes,
        gratitudes: user.gratitudes,
        fees: user.fees.order(what: :desc),
        interns: user.interns,
        phases: phases,
        responsabilities: responsabilities,
        roles: user.roles.pluck(:name)
      }
    end
  end
end
