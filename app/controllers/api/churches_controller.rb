class Api::ChurchesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    churches = Church.all
    render json: {churches: churches}
  end

  def show
    church = Church.find(params[:id])
    render json: {church: church}
  end

  def create
    church = Church.new(church_params)
    if church.save
      render json: { status: 200, church: church }
    else
      render json: { status: 422, errors: church.errors }
    end
  end

  def update
    church = Church.find(params[:id])
    if church.update(church_params)
      render json: { status: 200, church: church }
    else
      render json: { status: 422, errors: church.errors }
    end
  end

  def destroy
    church = Church.find(params[:id])
    church.destroy
    render json: { status: 200 }
  end

  private

  def church_params
    params[:church].permit(:name, :address, :zipcode, :town, :phone, :email, :website, :facebook, :twitter, :instagram, :latitude, :longitude, :user_id)
  end

end
