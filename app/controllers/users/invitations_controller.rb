class Users::InvitationsController < Devise::InvitationsController
  skip_before_action :verify_authenticity_token
  prepend_before_action :resource_from_invitation_token, :only => [:edit, :destroy]

  layout :set_layout, only: [:new, :create]

  def create
    self.resource = invite_resource
    resource_invited = resource.errors.empty?

    yield resource if block_given?

    if resource_invited
      if is_flashing_format? && self.resource.invitation_sent_at
        set_flash_message :notice, :send_instructions, email: self.resource.email
      end

      if @intranet_structure
        resource.add_role :member, @intranet_structure
      end

      respond_with resource
    else
      respond_with_navigational(resource) { render :new }
    end
  end

   def edit
    sign_out send("current_#{resource_name}") if send("#{resource_name}_signed_in?")
    set_minimum_password_length
    resource.invitation_token = params[:invitation_token]
    render :edit
  end

  def update
    invitation_token = params[:invitation_token]
    resource = User.accept_invitation!(update_resource_params)

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
    def invite_params
      params.require(:user).permit(:email,:firstname, :lastname, :level)
    end

    def resource_from_invitation_token
      unless params[:invitation_token] && self.resource = User.find_by(invitation_token: params[:invitation_token])
        set_flash_message(:alert, :invitation_token_invalid) if is_flashing_format?
        redirect_to after_sign_out_path_for(resource_name)
      end
    end

    def set_layout
      if request.subdomain && request.subdomain != '' && request.subdomain != 'admin'
        "Intranet/layouts/application"
      elsif request.subdomain && request.subdomain != '' && request.subdomain == 'admin'
        "admin/layouts/application"
      else
        "votes/layouts/application"
      end
    end

end