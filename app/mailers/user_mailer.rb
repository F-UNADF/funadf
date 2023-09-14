class UserMailer < ApplicationMailer


  def send_direct_access user
    @user = user

    @to = "p.gruson@gmail.com" if Rails.env == "development"
    @to = user.email if Rails.env == "production"

    @from = "sec.fnadf@addfrance.fr"

    mail(to: @to, from: @from, subject: "[FNADF / UNADF] ACTION REQUISE - Accès aux votes electroniques") do |format|
      format.html
    end

  end



end
