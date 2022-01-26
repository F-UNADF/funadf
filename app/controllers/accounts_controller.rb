class AccountsController < ApplicationController

  before_action :set_user

  def show
    @structures = current_user.structures

    @activities = PublicActivity::Activity.order("created_at desc")
                    .where(owner_id: @user.id, owner_type: "User")
                    .or(PublicActivity::Activity.where(trackable_id: @user.id, trackable_type: 'User'))
  end

  def edit
  end

  def update
    if @user.update(user_params)
      redirect_to me_url, flash:{success: 'Votre compte a été mis à jour.'}
     else
      render :edit
    end
  end

  private
    def set_user
      @user = current_user
    end

    def user_params
      User.allowed_params(params)
    end

end
