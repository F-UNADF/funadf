class UsersController < ApplicationController

  before_action :check_current_user

  def index
    @q = params['search'] unless params['search'].blank?
    @q = params['query'] unless params['query'].blank?


    @users = User.where('firstname LIKE ? OR lastname LIKE ?', "%#{@q}%", "%#{@q}%").order(:lastname)

    respond_to do |format|
      format.json {
        render json: @users
      }
    end
  end

  def show
    @user = User.find params[:id]
    @structures = @user.structures

    @activities = PublicActivity::Activity.order("created_at desc")
                    .where(owner_id: @user.id, owner_type: "User")
                    .or(PublicActivity::Activity.where(trackable_id: @user.id, trackable_type: 'User'))
  end

  private
    def check_current_user
      if current_user.id == params[:id]
        redirect_to me_path
      end
    end


end