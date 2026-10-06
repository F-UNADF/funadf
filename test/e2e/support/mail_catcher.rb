# Méthode d'envoi des e-mails de l'environnement e2e : chaque e-mail est écrit
# dans tmp/e2e/mails/<horodatage>.json, que les tests Playwright relisent
# (test/e2e/support/mails.js) pour suivre les liens d'invitation et de
# réinitialisation du mot de passe, comme le ferait le destinataire.
require 'json'
require 'fileutils'

class E2eMailCatcher
  DIR = File.expand_path('../../../tmp/e2e/mails', __dir__)

  def initialize(_settings = {}); end

  def deliver!(mail)
    FileUtils.mkdir_p(DIR)
    html = (mail.html_part || mail).body.decoded.to_s.force_encoding('UTF-8')
    payload = {
      to: Array(mail.to),
      subject: mail.subject,
      html: html,
      sent_at: Time.now.utc.iso8601(6)
    }
    name = format('%<time>s-%<rand>s.json', time: (Time.now.to_f * 1_000_000).to_i, rand: SecureRandom.hex(3))
    File.write(File.join(DIR, name), JSON.pretty_generate(payload))
  end
end
