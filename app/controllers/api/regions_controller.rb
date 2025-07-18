class Api::RegionsController < ApiController
  before_action :set_region, only: [:show, :update, :destroy, :add_members, :edit_roles, :remove_members]

  def index
    regions = Region.select("structures.*, users.lastname, users.firstname, users.id AS user_id")
                     .joins("LEFT JOIN memberships ON memberships.structure_id = structures.id AND memberships.role_ID IN (SELECT id FROM roles WHERE name IN ('president'))")
                      .joins("LEFT JOIN users ON users.id = memberships.member_id AND memberships.member_type = 'User'")

    render json: { regions: regions.all }
  end

  def show
    members = @region.members_with_details
    render json: { region: @region, members: members }
  end

  def create
    region = Region.new(region_params)
    if region.save
      render json: { status: 200, region: region }
    else
      render json: { status: 422, errors: region.errors }
    end
  end

  def update
    if @region.update(region_params)
      render json: { status: 200, region: @region }
    else
      render json: { status: 422, errors: @region.errors }
    end
  end

  def destroy
    @region.destroy
    render json: { status: 200 }
  end

  def add_members
    role_id = Role.find_by(name: :member)&.id
    return render json: { status: 400, error: "Role 'member' not found" } unless role_id

    members_params.each do |member|
      membership = Membership.create(
        structure_id: @region.id,
        role_id: role_id,
        member_id: member[:id],
        member_type: member[:type]
      )
    end

    members = @region.members_with_details
    render json: { status: 200, members: members }
  end

  def edit_roles
    member_data = params[:member]

    membership = Membership.find(member_data[:membership_id])
    role = Role.find_or_create_by(name: params[:role])
    membership.update(role_id: role.id)

    member_data[:role_name] = role.name

    render json: { status: 200, membership: member_data, members: @region.members_with_details}
  end

  def remove_members
    membership = Membership.find(params[:membership_id])
    membership.destroy

    render json: { status: 200 }
  end

  private

  def set_region
    @region = Region.find(params[:id])
  end

  def region_params
    params[:region].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :logo, :website)
  end

  def members_params
    params[:members].map do |member|
      member.permit(:id, :type)
    end
  end

end