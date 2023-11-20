class Api::AssociationsController < ApiController
  before_action :set_association, only: [:show, :update, :destroy, :add_members, :edit_roles, :remove_members]

  def index
    associations = []
    if current_user.is_admin?
      associations = Association.all
    elsif current_user.has_any_role? :president, :treasurer, :secretary
      associations = current_user.associations_responsabilities
    end
    render json: { associations: associations }
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
    role_id = Role.find_by(name: :member).id

    params[:members].each do |member|
      membership = Membership.new(
        structure_id: @association.id,
        member_id: member[:id],
        member_type: member[:type],
        role_id: role_id
      )
      membership.save
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

    render json: { status: 200, membership: member_data }
  end

  def remove_members
    membership = Membership.find(params[:membership_id])
    membership.destroy

    render json: { status: 200 }
  end

  private

  def set_association
    @association = Association.find(params[:id])
  end

  def association_params
    params[:association].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :logo)
  end

end