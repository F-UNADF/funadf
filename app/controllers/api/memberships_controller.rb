class Api::MembershipsController < ApiController

  def update
    membership = Membership.find(params[:id])
    membership.update(membership_params)
    render json: { status: 200, membership: membership }
  end

  def destroy
    membership = Membership.find(params[:id])
    membership.destroy
    render json: { status: 200 }
  end

  private

  def membership_params
    params.require(:membership).permit(:role_id, :can_vote)
  end

end
