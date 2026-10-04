# Contenu publié vers le réseau (actus, événements).
#
# - Le texte riche est affiché en v-html par la webapp et l'app mobile : il est
#   assaini à l'enregistrement ET dans le JSON servi (contenu déjà en base,
#   anciennes versions de l'app).
# - Visibilité pour un membre : même règle que le fil et les notifications
#   (adhésion directe à la structure et niveau de reconnaissance autorisé).
module Publishable
  extend ActiveSupport::Concern

  # Balises et attributs de l'éditeur (Quill) : listes par défaut de Rails,
  # plus le souligné, le barré, les couleurs (CSS filtré) et les liens externes.
  RICH_TEXT_TAGS       = (Rails::Html::SafeListSanitizer.allowed_tags.to_a + %w[u s]).freeze
  RICH_TEXT_ATTRIBUTES = (Rails::Html::SafeListSanitizer.allowed_attributes.to_a + %w[style target rel]).freeze

  def self.sanitize_html(html)
    return html if html.blank?

    Rails::Html::SafeListSanitizer.new.sanitize(html, tags: RICH_TEXT_TAGS, attributes: RICH_TEXT_ATTRIBUTES)
  end

  class_methods do
    def rich_text_attribute(name)
      @rich_text_attribute = name.to_s
      before_save { self[name] = Publishable.sanitize_html(self[name]) }
    end

    def rich_text_attribute_name
      @rich_text_attribute
    end
  end

  def serializable_hash(options = nil)
    hash = super
    attribute = self.class.rich_text_attribute_name
    hash[attribute] = Publishable.sanitize_html(hash[attribute]) if attribute && hash.key?(attribute)
    hash
  end

  def visible_to?(user)
    Membership.where(member_type: 'User', member_id: user.id, structure_id: structure_id).exists? &&
      accesses.where(level: user.level, can_access: true).exists?
  end
end
