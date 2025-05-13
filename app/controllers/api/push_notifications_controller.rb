class Api::PushNotificationsController < ApiController
  before_action :set_push_notification, only: [:show, :update, :destroy, :send_notification]

  def index
    render json: PushNotification.order(created_at: :desc)
  end

  def show
    render json: @push_notification, include: ['accesses']
  end

  def create
    notification = PushNotification.new push_notification_params

    params[:push_notification][:accesses].each do |level|
      notification.accesses.find_or_create_by(level: level[1], can_access: true)
    end
    notification.accesses.where.not(level: params[:push_notification][:accesses].values).destroy_all

    if notification.save
      render json: notification, status: :created
    else
      render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @push_notification.update push_notification_params
      params[:push_notification][:accesses].each do |level|
        notification.accesses.find_or_create_by(level: level[1], can_access: true)
      end
      notification.accesses.where.not(level: params[:push_notification][:accesses].values).destroy_all
      render json: @push_notification
    else
      render json: { errors: @push_notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @push_notification.destroy
    head :no_content
  end

  def send_notification
    tokens = DeviceToken.pluck(:token).uniq
    service = FcmNotificationService.new

    results = []
    tokens.each do |token|
      result = service.send_notification(
        token: token,
        title: @push_notification.title,
        body: @push_notification.body
      )
      results << result
    end

    @push_notification.update(sent_at: Time.current)

    render json: { status: "sent", count: tokens.size, results: results }
  end

  private

  def set_push_notification
    @push_notification = PushNotification.find(params[:id])
  end

  def push_notification_params
    params.require(:push_notification).permit(:title, :body, :url)
  end
end
