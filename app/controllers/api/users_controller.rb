class Api::UsersController < ApiController

  def index
    if @structure.nil?
      users = User.joins(
        "LEFT JOIN (SELECT user_id, MAX(start_at) AS max_start_at
        FROM careers
        WHERE level IS NOT NULL
        GROUP BY user_id
       ) latest_career ON users.id = latest_career.user_id"
      ).joins(
        "LEFT JOIN careers ON latest_career.user_id = careers.user_id AND latest_career.max_start_at = careers.start_at"
      ).select("users.*, COALESCE(careers.level, 'NR') AS current_level, '' AS avatar_url").uniq
    else
      users = @structure.users.joins(
        "LEFT JOIN (SELECT user_id, MAX(start_at) AS max_start_at
        FROM careers
        WHERE level IS NOT NULL
        GROUP BY user_id
       ) latest_career ON users.id = latest_career.user_id"
      ).joins(
        "LEFT JOIN careers ON latest_career.user_id = careers.user_id AND latest_career.max_start_at = careers.start_at"
      ).select("users.*, COALESCE(careers.level, 'NR') AS current_level, '' AS avatar_url").uniq
    end

    render json: {users: users}
  end

  def show
    @user = User.includes(:careers, :fees, :interns).find(params[:id])

    phases           = @user.phases.joins('JOIN structures AS church ON church.id = careers.church_id').select('careers.id, careers.start_at, careers.end_at, careers.church_id, CONCAT(church.name, "(", church.town, ")") AS church_name, careers.function').order(:start_at)
    responsabilities = @user.responsabilities.joins('JOIN structures AS association ON association.id = careers.association_id').select('careers.id, careers.start_at, careers.end_at, careers.association_id, association.name, careers.function').order(:start_at)

    render json: { user: @user, gratitudes: @user.gratitudes, fees: @user.fees, interns: @user.interns, phases: phases, responsabilities: responsabilities }
  end

  def create
    if User.invite! user_params
      user = User.find_by(email: user_params[:email])

      update_gratitudes(user)
      update_phases(user)
      update_responsabilities(user)
      update_fees(user)

      render json: { user: user }, status: 200
    else
      render json: { user: user, errors: user.errors.full_messages }, status: 422
    end
  end

  def update
    user = User.find(params[:user][:id])
    user.update(user_params)

    begin
      update_gratitudes(user)
      update_phases(user)
      update_responsabilities(user)
      update_fees(user)
    rescue => e
      render json: { status: 'error', error: e.message }
    end
    render json: { status: 'success', user: user }
  end

  def destroy
    user = User.find(params[:id])
    user.destroy

    render json: { status: 'success' }
  end

  def enable
    user = User.find(params[:id])
    user.update_attribute(:disabled, false)

    render json: { status: 'success', user: user }
  end

  def disable
    user = User.find(params[:id])
    user.update_attribute(:disabled, true)

    render json: { status: 'success', user: user }
  end

  private

  def user_params
    User.allowed_params(params)
  end

  def update_gratitudes(user)
    gratitudes_params = params[:gratitudes]
    return unless gratitudes_params.present?

    gratitudes_params.each do |gratitude_params|
      gratitude_id = gratitude_params[:id]
      if gratitude_id.present?
        c = Career.find_by(id: gratitude_id, user_id: user.id)
        c.update(gratitude_params.permit(:level, :start_at))
      else
        c = Career.new(level: gratitude_params[:level], start_at: gratitude_params[:start_at], user_id: user.id)
        c.save
      end
    end
  end

  def update_fees(user)
    fees_params = params[:fees]
    return unless fees_params.present?

    fees_params.each do |fee_params|
      fee_id = fee_params[:id]
      if fee_id.present?
        c = Fee.find_by(id: fee_id, user_id: user.id)
        c.update(fee_params.permit(:what, :amount, :paid_at))
      else
        c = Fee.new(what: fee_params[:what], amount: fee_params[:amount], paid_at: fee_params[:paid_at], user_id: user.id)
        c.save
      end
    end
  end

  def update_responsabilities(user)
    responsabilities_params = params[:responsabilities]
    return unless responsabilities_params.present?

    responsabilities_params.each do |responsability_params|
      responsability_id = responsability_params[:id]
      if responsability_id.present?
        responsability = Career.find_by(id: responsability_id, user_id: user.id)
        unless responsability&.update(responsability_params.permit(:start_at, :end_at, :association_id, :function, :user_id))
          raise "Error saving responsibility: #{responsability&.errors&.full_messages&.join(', ')}"
        end
      else
        responsibility = Career.new(responsability_params.permit(:function, :association_id, :start_at, :end_at).merge(user_id: user.id))
        unless responsibility.save
          raise "Error saving responsibility: #{responsibility.errors.full_messages.join(', ')}"
        end
      end
    end
  end

  def update_phases(user)
    phases_params = params[:phases]
    return unless phases_params.present?

    phases_params.each do |phase_params|
      phase_id = phase_params[:id]
      if phase_id.present?
        p = Career.find_by(id: phase_id, user_id: user.id)
        unless p.update(phase_params.permit(:start_at, :end_at, :church_id, :function, :user_id))
          throw "Error saving phase #{p.errors.full_messages}"
        end
      else
        p = Career.new(phase_params.permit(:function, :church_id, :start_at, :end_at).merge(user_id: user.id))
        unless p.save
          throw "Error saving phase #{p.errors.full_messages}"
        end
      end
    end
  end

end
