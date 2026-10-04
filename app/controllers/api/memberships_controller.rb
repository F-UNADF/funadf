class Api::MembershipsController < ApiController
  before_action :set_membership

  def update
    attributes = membership_params
    if attributes.key?(:role_id)
      role = Role.find_by(id: attributes[:role_id])
      return render json: { status: 422, error: 'Invalid role' }, status: :unprocessable_entity if role.nil? || APPLICATION_ROLES.include?(role.name)
    end

    @membership.update(attributes)
    render json: { status: 200, membership: @membership }
  end

  def destroy
    structure = @membership.structure
    @membership.destroy
    render json: { status: 200, members: structure.members_with_details }
  end

  def toggle_can_vote
    @membership.update(can_vote: !@membership.can_vote)
    render json: { status: 200, membership: @membership }
  end

  private

  # Admin, ou responsable de la structure de l'adhésion. Les rôles applicatifs
  # (adhésions sans structure) restent réservés aux admins.
  def set_membership
    @membership = Membership.find(params[:id])
    forbidden! unless @membership.structure_id.present? ? can_manage_structure?(@membership.structure_id) : admin?
  end

  def membership_params
    params.require(:membership).permit(:role_id, :can_vote)
  end

end
