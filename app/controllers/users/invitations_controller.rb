class Users::InvitationsController < Devise::InvitationsController
  skip_before_action :verify_authenticity_token
  prepend_before_action :resource_from_invitation_token, :only => [:edit, :destroy]

  # Le formulaire d'invitation Devise n'est pas utilisé (les admins invitent par
  # POST /api/users), mais devise_for route toujours new et create : une simple
  # session Devise, ouverte à l'acceptation d'une invitation, ne doit pas permettre
  # d'inviter quelqu'un.
  before_action :require_admin_or_moderator!, only: [:new, :create]

  def edit
    sign_out send("current_#{resource_name}") if send("#{resource_name}_signed_in?")
    set_minimum_password_length
    resource.invitation_token = params[:invitation_token]
    render :edit
  end

  def update
    invitation_token = params[:invitation_token]
    self.resource = User.accept_invitation!(update_resource_params)

    invitation_accepted = resource.errors.empty?

    if invitation_accepted
      flash_message = resource.active_for_authentication? ? :updated : :updated_not_active
      set_flash_message :notice, flash_message if is_flashing_format?
      sign_in(resource_name, resource)
      respond_with resource, :location => after_accept_path_for(resource)
    else
      resource.invitation_token = invitation_token
      respond_with_navigational(resource){
        render :edit
      }
    end
  end

  private
    def require_admin_or_moderator!
      head :forbidden unless current_user&.can_switch?
    end

    # Champs acceptés par Devise::InvitationsController#create (toujours routé)
    def invite_params
      params.require(:user).permit(:email,:firstname, :lastname, :level)
    end

    def resource_from_invitation_token
      # Le lien de l'e-mail porte le jeton brut ; la base n'en garde que l'empreinte
      unless params[:invitation_token] && self.resource = User.find_by_invitation_token(params[:invitation_token], true)
        set_flash_message(:alert, :invitation_token_invalid) if is_flashing_format?
        redirect_to after_sign_out_path_for(resource_name)
      end
    end
end