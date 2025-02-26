class Category < ActiveRecord::Base

  belongs_to :structure
  belongs_to :category, optional: true

  has_many :events, dependent: :nullify
  has_many :documents, dependent: :nullify
  has_many :subcategories, class_name: 'Category', foreign_key: 'category_id', dependent: :destroy

  validates :name, presence: true

  # scope kind = 'document' pour les catégories de documents
  scope :documents, -> { where(kind: 'document') }

  def as_tree
    {
      id: id,
      order: order,
      type: 'category',
      name: name,
      categories: subcategories.order(:order).map(&:as_tree),
      documents: documents.order(:order).map do |doc|
        {
          id: doc.id,
          name: doc.name,
          order: doc.order,
          description: doc.description,
          type: doc.class.name.downcase,
          href: Rails.application.routes.url_helpers.rails_blob_path(doc.file, disposition: "attachment")
        }
      end
    }
  end

  def font_color
    # remove hashtag
    c = color

    hexa = c.gsub! '#', ''

    r = hexa[0..1].hex
    g = hexa[2..3].hex
    b = hexa[4..5].hex

    if (r * 0.299 + g * 0.587 + b * 0.114) > 186
      '#000000'
    else
      '#ffffff'
    end
  end

end
