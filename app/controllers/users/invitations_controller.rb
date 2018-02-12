class Users::InvitationsController < Devise::InvitationsController

  layout "application", only: [:new, :create]


  private
    def invite_params
      params.require(:user).permit(:email,:firstname, :lastname)
    end
end