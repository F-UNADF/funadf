class DeviseMailer < Devise::Mailer

  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'mailer' # to make sure that your mailer uses the devise views

  def invitation_instructions(record, token, opts={})
    opts[:subject] = "[FNADF] Bienvenue sur l'interface de votes électroniques"
    super
  end

end
