class Api::ChurchesController < ApiController
  before_action :set_church, only: [:show, :update, :destroy, :add_members, :edit_roles, :remove_members]
  before_action :require_admin!, only: [:create, :destroy]
  before_action :require_manager!, only: [:update, :add_members, :edit_roles, :remove_members]

  def index
    churches = Church.all

    if params[:search].present?
      churches = churches.where(
        "structures.name LIKE :q OR structures.zipcode LIKE :q OR structures.town LIKE :q",
        q: "%#{params[:search]}%"
      )
    end

    render json: { churches: churches.as_json(include: ['president']) }
  end

  def show
    members = @church.members_with_details
    render json: { church: @church, members: members }
  end

  def create
    church = Church.new(church_params)
    if church.save
      render json: { status: 200, church: church }
    else
      render json: { status: 422, errors: church.errors }
    end
  end

  def update
    if @church.update(church_params)
      render json: { status: 200, church: @church }
    else
      render json: { status: 422, errors: @church.errors }
    end
  end

  def destroy
    @church.destroy
    render json: { status: 200 }
  end

  def add_members
    role_id = Role.find_by(name: :member)&.id
    return render json: { status: 400, error: "Role 'member' not found" } unless role_id

    members_params.each do |member|
      next unless %w[User Structure].include?(member[:type])

      membership = Membership.create(
        structure_id: @church.id,
        role_id: role_id,
        member_id: member[:id],
        member_type: member[:type]
      )
    end

    members = @church.members_with_details
    render json: { status: 200, members: members }
  end

  def edit_roles
    member_data = params[:member]

    membership = @church.memberships.find(member_data[:membership_id])
    role = structure_role(params[:role])
    return render json: { status: 422, error: 'Invalid role' }, status: :unprocessable_entity unless role

    membership.update(role_id: role.id)

    member_data[:role_name] = role.name

    render json: { status: 200, membership: member_data, members: @church.members_with_details }
  end

  def remove_members
    membership = @church.memberships.find(params[:membership_id])
    membership.destroy

    render json: { status: 200, members: @church.members_with_details }
  end

  private

  # Admin, ou responsable de cette structure (association ou région).
  def require_manager!
    forbidden! unless can_manage_structure?(@church)
  end

  def set_church
    @church = Church.find(params[:id])
  end

  def church_params
    params[:church].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :logo, :website)
  end

  def members_params
    params[:members].map do |member|
      member.permit(:id, :type)
    end
  end

end