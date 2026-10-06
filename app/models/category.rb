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
          url: doc.url,
          type: (doc.url?) ? 'url' : doc.class.name.downcase,
          href: (doc.url?) ? doc.url : Rails.application.routes.url_helpers.rails_blob_path(doc.file, disposition: "attachment")
        }
      end
    }
  end
end
