class UserMailer < ApplicationMailer


  def send_direct_access user

    @user = user

    @to = "p.gruson@gmail.com" if Rails.env == "development"
    @to = user.email if Rails.env == "production"

    @from = "sec.fnadf@addfrance.fr"

    mail(to: @to, from: @from, subject: "[FNADF / UNADF] Votre lien d'accès aux votes électroniques") do |format|
      format.html
    end

  end



end
