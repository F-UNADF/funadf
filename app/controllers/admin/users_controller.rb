class Admin::UsersController < AdminController

  layout 'admin/layouts/vuejs'

  def index
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