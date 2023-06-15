class Api::CampaignsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_campaign, only: [:show, :update, :destroy]

  def index
    campaigns = Campaign.order id: :desc
    render json: { campaigns: campaigns }
  end

  def show
    motions = @campaign.motions.order(id: :asc)
    voting_table = @campaign.voting_tables
    render json: { campaign: @campaign, motions: motions, voting_table: voting_table }
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
      membership = Membership.new(
        structure_id: @church.id,
        member_id: member[:id],
        member_type: member[:type],
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

  def set_campaign
    @campaign = Campaign.find(params[:id])
  end

  def church_params
    params[:church].permit(:name, :address_1, :address_2, :zipcode, :town, :phone_1, :phone_2, :email, :logo)
  end

end