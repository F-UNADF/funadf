class UserMailer < ApplicationMailer

  def notification_digest(user, notification_ids)
    @user = user
    @notifications = Notification.where(id: notification_ids)

    mail(
      to: user.email,
      from: "noreply@addfrance.fr",
      subject: "[ADD+] Le récap de la semaine !"
    )
  end

end
