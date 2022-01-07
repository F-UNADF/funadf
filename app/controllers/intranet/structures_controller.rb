class Intranet::StructuresController < IntranetController


  def index
    respond_to do |format|
      format.json {
        @structures = Structure.where(type: params[:type]).where('name LIKE ? OR town LIKE ?', "%#{params[:query]}%", "%#{params[:query]}%").order(name: :asc)
        render json: @structures
      }
      format.html {
        @q = @intranet_structure.structures.order(name: :asc).ransack(params[:q])
        @structures = @q.result(distinct: true).paginate(:page => params[:page], per_page: 50)
      }
    end

  end

  def show
    @user = User.find params[:id]
    @structures = @user.structures
  end

  def edit
    @user = User.find params[:id]
  end


  private
    def check_current_user
      if current_user.id == params[:id]
        redirect_to me_path
      end
    end

    def user_params
      if params[:user][:password].blank?
        params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2,
                          :email, :level, :birthdate)
      else
        params[:user].permit(:firstname, :lastname, :avatar, :address_1,
                          :address_2, :zipcode, :town, :phone_1, :phone_2,
                          :email, :level, :birthdate, :password, :password_confirmation)
      end
    end

end