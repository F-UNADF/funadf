class Api::ChurchesController < ApiController
  before_action :set_church, only: [:show, :update, :destroy, :add_members, :edit_roles, :remove_members]

  def index
    churches = Church.select("structures.*, users.lastname, users.firstname")
                     .joins("LEFT JOIN memberships ON memberships.structure_id = structures.id AND memberships.role_ID IN (SELECT id FROM roles WHERE name IN ('president'))")
                      .joins("LEFT JOIN users ON users.id = memberships.member_id AND memberships.member_type = 'User'")

    # Add the condition if @structure is present
    if @structure.present?
      churches = @structure.churches.select("structures.*, users.lastname, users.firstname")
                           .joins("LEFT JOIN memberships ON memberships.structure_id = structures.id AND memberships.role_ID IN (SELECT id FROM roles WHERE name IN ('president'))")
                           .joins("LEFT JOIN users ON users.id = memberships.member_id AND memberships.member_type = 'User'")
    end

    # $api_url = 'https://add-fnadf.fr/api/churches.json?search=' . $keywords . '&dpt=' . $dpt;
    # FROM WORDPRESS PLUGINS
    if params[:search].present?
      # On géolocalise la recherche
      results = Geocoder.search(params[:search])
      if results.present?
        churches = Church.near(results.first.coordinates, 50, units: :km)
      else
        churches = Church.none
      end
    end

    if params[:dpt].present?
      churches = churches.where("zipcode LIKE ?", "#{params[:dpt]}%")
    end

    render json: { churches: churches.all }
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
    role_id = Role.find_by(name: :member).id

    params[:members].each do |member|
      m = member.split('#')
      membership = Membership.new(
        structure_id: @church.id,
        member_id: m[0],
        member_type: m[1],
        role_id: role_id
      )
      membership.save
    end

    members = @church.members_with_details
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

  def set_church
    @church = Church.find(params[:id])
  end

  def church_params
    params[:church].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :logo, :website)
  end

end