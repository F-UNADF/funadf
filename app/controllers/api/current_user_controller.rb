class Api::CurrentUserController < ApiController
  def show
    @user = current_user
    @original_user = SwitchUser::Provider.init(self).original_user

    # if @user is equal to @original_user, then set original_user to nil
    # this is to prevent the frontend from displaying the switch user button
    if @user == @original_user
      @original_user = nil
    end

    respond_to do |format|
      format.json { render json: {user: @user, original_user: @original_user} }
    end
  end
end
