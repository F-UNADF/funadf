class DeviseMailerPreview
  def reset_password_instructions
    DeviseMailer.reset_password_instructions record, token, opts
  end


  def invitation_instructions
    DeviseMailer.invitation_instructions record, token, opts
  end
end
