class Intranet::UsersController < IntranetController

  before_action :check_current_user

  def index
    respond_to do |format|
      format.json {
        @users = User.all
        if params[:query]
          @users = User.where("firstname LIKE '#{params[:query]}%' OR lastname LIKE '#{params[:query]}%' ")
        end
        render json: @users
      }
      format.html {
        @q = @intranet_structure.users.order(lastname: :asc).ransack(params[:q])
        @users = @q.result(distinct: true).paginate(:page => params[:page], per_page: 50)
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

  def edit
    @user = User.find params[:id]
  end

  def update
    @user = User.find params[:id]
    @user.reset_password_token = Time.now

    if @user.update(user_params)
      redirect_to [:intranet, :users], flash:{success: 'L\'utilisateur a été mis à jour.'}
     else
      render :edit
    end
  end


  private
    def check_current_user
      if current_user.id == params[:id]
        redirect_to me_path
      end
    end

    def user_params
      User.allowed_params(params)
    end

end