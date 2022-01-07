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
      if params[:user][:password].blank?
        params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2,
                          :email, :level, :birthdate, :avatar, :biography,
                          husband_marriage_attributes: [:husband_id, :wife_id],
                          wife_marriage_attributes: [:husband_id, :wife_id],
                          gratitudes_attributes: [:id, :level, :referent_id, :start_at, :_destroy],
                          phases_attributes: [:id, :church_id, :function, :start_at, :end_at, :_destroy],
                          responsabilities_attributes: [:id, :association_id, :function, :start_at, :end_at, :_destroy])
      else
        params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2, :biography,
                          :email, :level, :birthdate, :password, :password_confirmation, :avatar,
                          husband_marriage_attributes: [:husband_id, :wife_id],
                          wife_marriage_attributes: [:husband_id, :wife_id],
                          gratitudes_attributes: [:id, :level, :referent_id, :start_at, :_destroy],
                          phases_attributes: [:id, :church_id, :function, :start_at, :end_at, :_destroy],
                          responsabilities_attributes: [:id, :association_id, :function, :start_at, :end_at, :_destroy])
      end
    end


end