class Api::UsersController < ApiController
  before_action :find_user, only: [:show, :update, :destroy, :enable, :disable, :add_role, :remove_role, :send_invitation]

  def index
    users = @structure.nil? ? User : @structure.users
    users = users.left_joins(:roles)
                 .select("users.*, GROUP_CONCAT(roles.name) as roles")
                 .group('users.id')

    render json: { users: users.map { |user| user.attributes.merge('current_level' => user.level) } }
  end

  def show
    render json: user_data
  end

  def create
    user = User.invite!(user_params)

    if user.persisted?
      update_user_data(user)
      render json: { user: user }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      update_user_data(@user)
      render json: { status: 'success', user: @user }
    else
      render json: { status: 'error', errors: @user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  # Other actions...

  private

  def find_user
    @user = User.includes(:careers, :fees, :interns).find(params[:id])
  end

  def user_data
    {
      user: @user.attributes,
      gratitudes: @user.gratitudes,
      fees: @user.fees.order(what: :desc),
      interns: @user.interns,
      phases: @user.phases,
      responsibilities: @user.responsabilities,
      roles: @user.roles.pluck(:name)
    }
  end

  def update_user_data(user)
    update_careers(user, :gratitudes)
    update_careers(user, :fees)
    update_careers(user, :responsabilities)
    update_careers(user, :phases)
  end

  def update_careers(user, type)
    careers_params = params[type]

    print careers_params.inspect
    print "\n"

    return unless careers_params.present?

    careers_params.each do |career_params|
      params = career_params.last.permit(:id, :level, :start_at, :user_id)
      career_id = params[:id]
      career = user.send(type).find_or_initialize_by(id: career_id)
      career.assign_attributes(params)
      career.save!
    end
  end

  def user_params
    User.allowed_params(params)
  end
end
