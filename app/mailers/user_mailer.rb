class UserMailer < ApplicationMailer

  def notification_digest(user, notifications)
    @user = user
    @notifications = notifications
    mail(to: user.email, subject: "[ADD+] Vous avez #{notifications.count} nouvelle(s) notification(s)")
  end

end
