class Api::DocumentsController < ApiController
  def index
    categories = Category.documents.where(category_id: nil).includes(:subcategories, :documents).order(:order)

    # Générer l'arbre pour les catégories existantes
    tree = categories.map(&:as_tree)

    # Récupérer les documents non catégorisés
    uncategorized_docs = Document.where(category_id: nil).order(:order)

    if uncategorized_docs.exists?
      tree << {
        id: -1,
        name: "Non répertoriés",
        type: 'folder',
        order: tree.count + 1,
        categories: [],
        documents: uncategorized_docs.map do |doc|
          {
            id: doc.id,
            name: doc.name,
            description: doc.description,
            type: doc.class.name.downcase,
            href: Rails.application.routes.url_helpers.rails_blob_path(doc.file, disposition: "attachment")
          }
        end
      }
    end

    render json: tree
  end

  def create
    if params[:files]
      params[:files].each do |file|
        doc = Document.new
        doc.name = clean_filename(File.basename(file.original_filename, ".*"))
        doc.file.attach(file)
        doc.save
      end
      render json: { success: true }
    else
      render json: { success: false, error: 'No files received' }, status: :unprocessable_entity
    end

  end

  def update_order
    items = params[:items]
    process_items(items, nil)
    render json: { success: true }
  end

  def update
    document = Document.find(params[:id])
    if document.update(document_params)
      render json: { success: true }
    else
      render json: { success: false, error: document.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def destroy
    document = Document.find(params[:id])
    document.destroy

    render json: { success: true }
  end

  private

  def process_items(items, parent_id)
    items.each_with_index do |item, index|
      # Mise à jour de l'élément courant
      if item['type'] == 'category' && item['id'] != -1
        category = Category.find(item['id'])
        category.update(order: index + 1, category_id: (parent_id && parent_id > 0) ? parent_id : nil)
      elsif item['type'] == 'document'
        document = Document.find(item['id'])
        document.update(order: index + 1, category_id: (parent_id && parent_id > 0) ? parent_id : nil)
      end

      # Gestion des enfants (documents et catégories)
      if item['categories'].present?
        process_items(item['categories'], item['id'])
      end

      if item['documents'].present?
        process_items(item['documents'], item['id'])
      end
    end
  end

  def document_params
    params.permit(:name, :description, files: [])
  end

  def clean_filename(filename)
    # 1. Supprimer les accents
    cleaned = I18n.transliterate(filename)

    # 2. Remplacer les espaces et caractères spéciaux par des underscores
    cleaned = cleaned.gsub(/[^0-9A-Za-z.\-]/, '_')

    # 3. Éviter les underscores multiples consécutifs
    cleaned = cleaned.gsub(/_+/, '_')

    # 4. Supprimer les underscores en début/fin
    cleaned = cleaned.gsub(/^_|_$/, '')

    cleaned.downcase
  end

end
