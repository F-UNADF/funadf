class Api::AssociationsController < ApiController
  before_action :set_association, only: [:show, :update, :destroy, :add_members, :edit_roles, :remove_members]

  def index
    associations = Association.select("structures.*, users.lastname, users.firstname, users.id AS user_id")
                     .joins("LEFT JOIN memberships ON memberships.structure_id = structures.id AND memberships.role_ID IN (SELECT id FROM roles WHERE name IN ('president'))")
                      .joins("LEFT JOIN users ON users.id = memberships.member_id AND memberships.member_type = 'User'")

    case params[:domain]
    when 'region'
      region_structure_ids = current_user.regions_responsabilities.pluck('structures.id').uniq
      associations = associations.where(id: region_structure_ids)
    when 'association'
      association_structure_ids = current_user.associations_responsabilities.pluck('structures.id').uniq
      associations = associations.where(id: association_structure_ids)
    end

    render json: { associations: associations.all }
  end

  def show
    members = @association.members_with_details
    render json: { association: @association, members: members }
  end

  def create
    association = Association.new(association_params)
    if association.save
      render json: { status: 200, association: association }
    else
      render json: { status: 422, errors: association.errors }
    end
  end

  def update
    if @association.update(association_params)
      render json: { status: 200, association: @association }
    else
      render json: { status: 422, errors: @association.errors }
    end
  end

  def destroy
    @association.destroy
    render json: { status: 200 }
  end

  def add_members
    role_id = Role.find_by(name: :member)&.id
    return render json: { status: 400, error: "Role 'member' not found" } unless role_id

    members_params.each do |member|
      membership = Membership.create(
        structure_id: @association.id,
        role_id: role_id,
        member_id: member[:id],
        member_type: member[:type]
      )
    end

    members = @association.members_with_details
    render json: { status: 200, members: members }
  end

  def edit_roles
    member_data = params[:member]

    membership = Membership.find(member_data[:membership_id])
    role = Role.find_or_create_by(name: params[:role])
    membership.update(role_id: role.id)

    member_data[:role_name] = role.name

    render json: { status: 200, membership: member_data, members: @association.members_with_details }
  end

  def remove_members
    membership = Membership.find(params[:membership_id])
    membership.destroy

    render json: { status: 200, members: @association.members_with_details }
  end

  private

  def set_association
    @association = Association.find(params[:id])
  end

  def association_params
    params[:association].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :logo)
  end

  def members_params
    params[:members].map do |member|
      member.permit(:id, :type)
    end
  end

end