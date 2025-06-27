class Api::NotificationsController < ApiController
  
  def index
    notifications = current_user.notifications.where(read: !params[:unread]).order(created_at: :desc).limit(10)
    render json: { notifications: notifications }, include: ['notifiable', 'sender']
  end

  def mark_as_read
    notification = current_user.notifications.find(params[:id])
    notification.update(read: true)
    render json: { success: true }
  end

  def mark_all_as_read
    current_user.notifications.update_all(read: true)
    render json: { success: true }
  end
  
end
