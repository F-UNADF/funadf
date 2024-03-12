class Api::ProfileController < ApplicationController
  def show
    phases           = current_user.phases.joins('JOIN structures AS church ON church.id = careers.church_id').select('careers.id, careers.start_at, careers.end_at, careers.church_id, CONCAT(church.name, "(", church.town, ")") AS church_name, careers.function').order(start_at: :desc)
    responsabilities = current_user.responsabilities.joins('JOIN structures AS association ON association.id = careers.association_id').select('careers.id, careers.start_at, careers.end_at, careers.association_id, association.name, careers.function').order(:start_at)
    presidences = current_user.get_presidences.select('structures.*, structures.type AS mtype')

    render json: {
        profile: current_user,
        gratitudes: current_user.gratitudes,
        fees: current_user.fees.order(what: :desc).limit(5),
        presidences: presidences,
        phases: phases,
        responsabilities: responsabilities,
        roles: current_user.application_roles
    }
  end
end
