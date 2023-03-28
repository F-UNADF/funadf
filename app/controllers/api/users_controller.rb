class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    users = User.joins(
      "LEFT JOIN (SELECT user_id, MAX(start_at) AS max_start_at
        FROM careers
        WHERE level IS NOT NULL
        GROUP BY user_id
       ) latest_career ON users.id = latest_career.user_id"
    ).joins(
      "LEFT JOIN careers ON latest_career.user_id = careers.user_id AND latest_career.max_start_at = careers.start_at"
    ).select("users.*, COALESCE(careers.level, 'NR') AS current_level, '' AS avatar_url")

    render json: users
  end

  def show
    @user = User.includes(:careers, :fees, :interns).find(params[:id])

    phases           = @user.phases.joins('JOIN structures AS church ON church.id = careers.church_id').select('careers.id, careers.start_at, careers.end_at, careers.church_id, CONCAT(church.name, "(", church.town, ")") AS church_name, careers.function').order(:start_at)
    responsabilities = @user.responsabilities.joins('JOIN structures AS association ON association.id = careers.association_id').select('careers.id, careers.start_at, careers.end_at, careers.association_id, association.name, careers.function').order(:start_at)

    render json: { user: @user, gratitudes: @user.gratitudes, fees: @user.fees, interns: @user.interns, phases: phases, responsabilities: responsabilities }
  end

  def create
    user = User.create(user_params)

    if User.invite! user.attributes
      render json: { user: user }, status: 200
    else
      render json: { user: user, errors: user.errors.full_messages }, status: 422
    end
  end

  def update
    user = User.find(params[:user][:id])
    user.update(user_params)

    params[:gratitudes].each do |gratitude|
      if !gratitude[:id].blank?
        c = Career.find(gratitude[:id])
        c.update(gratitude.permit(:level, :start_at))
      else
        c = Career.new level: gratitude[:level], start_at: gratitude[:start_at], user_id: user.id
        c.save
      end
    end

    params[:phases].each do |phase|
      if phase[:id]
        p = Career.find(phase[:id])
        p.update phase.permit(:start_at, :end_at, :church_id, :function, :user_id)
      else
        p = Career.new phase.permit(:start_at, :end_at, :church_id, :function, :user_id)
        p.save
      end
    end

    render json: { status: 'success', user: user }
  end

  def destroy
    user = User.find(params[:id])
    user.destroy

    render json: { status: 'success' }
  end

  def enable
    user = User.find(params[:id])
    user.update_attribute(:disabled, false)

    render json: { status: 'success', user: user }
  end

  def disable
    user = User.find(params[:id])
    user.update_attribute(:disabled, true)

    render json: { status: 'success', user: user }
  end

  private

  def user_params
    params.require(:user).permit(:firstname, :lastname, :email, :phone_1, :address_1, :address_2, :zipcode, :town, :birthdate)
  end

end
