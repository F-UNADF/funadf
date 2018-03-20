class DeviseMailerPreview < ActionMailer::Preview

  def invitation_instructions
    DeviseMailer.invitation_instructions(User.first, "faketoken")
  end

  def reset_password_instructions
    DeviseMailer.reset_password_instructions(User.first, "fakeToken")
  end

end
