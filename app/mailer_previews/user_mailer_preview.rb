class UserMailerPreview

  def send_direct_access
    UserMailer.send_direct_access User.last
  end

end
