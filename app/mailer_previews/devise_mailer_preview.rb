class DeviseMailerPreview < ActionMailer::Preview

  def invitation_instructions
    DeviseMailer.invitation_instructions(User.first, "faketoken")
  end

end
