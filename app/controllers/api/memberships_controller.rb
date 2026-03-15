class Api::MembershipsController < ApiController

  def update
    membership = Membership.find(params[:id])
    membership.update(membership_params)
    render json: { status: 200, membership: membership }
  end

  def destroy
    membership = Membership.find(params[:id])
    structure = membership.structure
    membership.destroy
    render json: { status: 200, members: structure.members_with_details }
  end

  def toggle_can_vote
    membership = Membership.find(params[:id])
    membership.update(can_vote: !membership.can_vote)
    render json: { status: 200, membership: membership }
  end

  private

  def membership_params
    params.require(:membership).permit(:role_id, :can_vote)
  end

end
