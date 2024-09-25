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

    user_with_custom_attribute = @user.as_json
    user_with_custom_attribute[:level] = @user.level

    render json: {
      user: user_with_custom_attribute,
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

      unless @structure.nil?
        user.add_role :member, @structure
      end

      render json: { user: user }, status: 200
    else
      render json: { user: user, errors: user.errors.full_messages }, status: 422
    end
  end

  def update
    user = User.find(params[:id])
    user.update(user_params)

    update_gratitudes(user)
    update_phases(user)
    update_responsabilities(user)
    update_fees(user)

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
    User.allowed_params(params[:user])
  end

  def update_gratitudes(user)
    gratitudes_params = params[:user][:gratitudes]

    if gratitudes_params.blank?
      user.gratitudes.destroy_all
      return
    end

    # On supprime les lignes qui n'existes plus
    user.gratitudes.where.not(id: gratitudes_params.values.map{ |p| p[:id] }).destroy_all

    gratitudes_params.each do |gratitude_params|
      gratitude_id = gratitude_params.last[:id]
      if gratitude_id.present?
        c = Career.find_by(id: gratitude_id, user_id: user.id)
        c.update(gratitude_params.last.permit(:level, :start_at))
      else
        c = Career.new(level: gratitude_params.last[:level], start_at: gratitude_params.last[:start_at], user_id: user.id)
        c.save
      end
    end
  end

  def update_fees(user)
    fees_params = params[:user][:fees]
    return unless fees_params.present?

    fees_params.each do |fee_params|
      fee_id = fee_params.last[:id]
      if fee_id.present?
        c = Fee.find_by(id: fee_id, member_id: user.id)
        c.update(fee_params.last.permit(:what, :amount, :paid_at))
      else
        c = Fee.new(what: fee_params.last[:what], amount: fee_params.last[:amount], paid_at: fee_params.last[:paid_at], member_id: user.id, member_type: 'User')
        c.save
      end
    end
  end

  def update_responsabilities(user)
    responsabilities_params = params[:user][:responsabilities]

    if responsabilities_params.blank?
      user.responsabilities.destroy_all
      return
    end

    # On supprime les lignes qui n'existes plus
    user.responsabilities.where.not(id: responsabilities_params.values.map{ |p| p[:id] }).destroy_all

    responsabilities_params.each do |responsability_params|
      responsability_id = responsability_params.last[:id]
      if responsability_id.present?
        responsability = Career.find_by(id: responsability_id, user_id: user.id)
        responsability.update(responsability_params.last.permit(:start_at, :end_at, :association_id, :function, :user_id))
      else
        responsibility = Career.new(responsability_params.last.permit(:function, :association_id, :start_at, :end_at).merge(user_id: user.id))

        responsibility.save
      end
    end
  end

  def update_phases(user)
    phases_params = params[:user][:phases]

    if phases_params.blank?
      user.phases.destroy_all
      return
    end

    # On supprime les lignes qui n'existes plus
    user.phases.where.not(id: phases_params.values.map{ |p| p[:id] }).destroy_all

    phases_params.each do |phase_params|
      phase_id = phase_params.last[:id]
      if phase_id.present?
        p = Career.find_by(id: phase_id, user_id: user.id)
        p.update(phase_params.last.permit(:start_at, :end_at, :church_id, :function, :user_id))
      else
        p = Career.new(phase_params.last.permit(:function, :church_id, :start_at, :end_at).merge(user_id: user.id))
        p.save
      end
    end
  end

end
