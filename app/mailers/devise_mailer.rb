class DeviseMailer < Devise::Mailer
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'mailer' # to make sure that your mailer uses the devise views

  def invitation_instructions(record, token, opts={})
    opts[:subject] = "[ADD+] Bienvenue sur l'interface de votes électroniques"
    super
  end

  def reset_password_instructions(record, token, opts={})
    opts[:subject] = "[ADD+] Réinitialiser mon mot de passe"
    super
  end

end
