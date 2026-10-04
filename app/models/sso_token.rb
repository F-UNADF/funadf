class SsoToken < ActiveRecord::Base
  # Jeton de connexion rapide (SSO) vers une application tierce (Archivate).
  # À usage unique et à courte durée de vie : généré quand l'utilisateur clique
  # sur le lien, échangé une seule fois par l'application cible, puis consommé.

  TTL = 2.minutes

  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  before_validation :generate_token, on: :create

  scope :usable, -> { where(used_at: nil).where('expires_at > ?', Time.now) }

  def expired?
    expires_at <= Time.now
  end

  def used?
    used_at.present?
  end

  def usable?
    !used? && !expired?
  end

  # Consomme le jeton (usage unique) et renvoie true s'il était valide.
  def consume!
    return false unless usable?

    update!(used_at: Time.now)
    true
  end

  private

  def generate_token
    self.token ||= SecureRandom.hex(32)
    self.expires_at ||= Time.now + TTL
  end
end
