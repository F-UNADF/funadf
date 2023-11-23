class Api::RolesController < ApiController

  def index
    roles = Role.all
    render json: { roles: roles }
  end

  def show
    role = Role.find(params[:id])
    render json: { role: role }
  end

  def create
    role = Role.new(role_params)
    if role.save
      render json: { role: role }
    else
      render json: { errors: role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    role = Role.find(params[:id])
    if role.update(role_params)
      render json: { role: role }
    else
      render json: { errors: role.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    role = Role.find(params[:id])
    role.destroy
    render json: { message: 'Role deleted' }
  end

  private

  def role_params
    params.require(:role).permit(:name, :friendly_name, :short_descriptions)
  end

end