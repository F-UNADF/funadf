class Admin::UsersController < AdminController

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
        @q = User.order(lastname: :asc).ransack(params[:q])

        if params[:page].blank?
          params[:page] = session[:user_page]
        end

        @users = @q.result(distinct: true).paginate(:page => params[:page], per_page: 50)
        session[:user_page] = params[:page] if params[:page]
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

    if @user.update!(user_params)
      redirect_to [:admin, :users], flash:{success: 'L\'utilisateur a été mis à jour.'}
     else
      render :edit
    end
  end

  def destroy
    @user = User.find params[:id]
    @user.destroy
    redirect_to [:admin, :users], flash:{success: 'Utilisateur supprimé'}
  end

  def enable
    @user = User.find params[:user_id]
    @user.disabled = false
    @user.save

    redirect_back fallback_location: root_path, flash:{success: 'Utilisateur mis a jour'}
  end
  def disable
    @user = User.find params[:user_id]
    @user.disabled = true
    @user.save

    redirect_back fallback_location: root_path, flash:{success: 'Utilisateur mis a jour'}
  end

  private
    def user_params
      User.allowed_params(params)
    end


end