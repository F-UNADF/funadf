class UserMailer < ApplicationMailer

  def notification_digest(user, notifications)
    @user = user
    @notifications = notifications
    mail(to: user.email, from: "noreply@addfrance.fr", subject: "[ADD+] Le récap de la semaine !")
  end

end
