class Api::UsersController < ApiController

  def index
    if @structure.nil?
      users = User.left_joins(:roles)
                  .select("users.*, GROUP_CONCAT(roles.name) as roles")
                  .group('users.id')
    else
      users = @structure.users.left_joins(:roles)
                        .select("users.*, GROUP_CONCAT(roles.name) as roles")
                        .group('users.id')
    end

    render json: {users: users.map { |user| user.attributes.merge('current_level' => user.level)  }}
  end

  def show
    @user = User.includes(:careers, :fees, :interns).find(params[:id])

    phases           = @user.phases.joins('JOIN structures AS church ON church.id = careers.church_id').select('careers.id, careers.start_at, careers.end_at, careers.church_id, CONCAT(church.name, "(", church.town, ")") AS church_name, careers.function').order(:start_at)
    responsabilities = @user.responsabilities.joins('JOIN structures AS association ON association.id = careers.association_id').select('careers.id, careers.start_at, careers.end_at, careers.association_id, association.name, careers.function').order(:start_at)

    render json: {
      user: @user.attributes,
      gratitudes: @user.gratitudes,
      fees: @user.fees.order(what: :desc),
      interns: @user.interns,
      phases: phases,
      responsabilities: responsabilities,
      roles: @user.roles.pluck(:name)
    }
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
    # if @structure is set, remove user from memberships of this structure
    if @structure.present?
      @structure.memberships.where(member_id: params[:id], member_type: 'User').destroy_all
      render json: { status: 'success' }
      return
    end
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

  def add_role
    user = User.find(params[:id])
    user.add_role params[:role]

    render json: { status: 'success', user: user }
  end

  def remove_role
    user = User.find(params[:id])
    user.remove_role params[:role]

    render json: { status: 'success', user: user }
  end

  def send_invitation
    user = User.find(params[:id])
    user.invite!

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
