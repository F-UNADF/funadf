class Api::PostsController < ApiController
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    posts = Post.includes(:structure).all.order(created_at: :desc)

    if params[:search].present?
      posts = posts.joins(:structure).where(
        "title LIKE :q OR content LIKE :q OR structures.name LIKE :q",
        q: "%#{params[:search]}%"
      )
    end

    render json: {posts: posts.as_json(include: ['structure', 'accesses'])}
  end

  def show
    files_data = @post.files.map do |file|
      {
        existing: true,
        id: file.id,
        name: file.filename.to_s,
        url: url_for(file),
        type: file.content_type,
        size: file.byte_size
      }
    end
    accesses = @post.accesses.map do |access|
      { title: access.level, value: access.level }
    end
    post = @post.as_json.merge(
      images: @post.images.map { |image| url_for(image) },
      existing_attachments: files_data,
      structure: @post.structure.as_json,
      accesses: accesses
    )

    render json: { post: post }
  end

  def create
    @post = Post.new(post_params)

    # 1. Normaliser les nouveaux fichiers
    attachments = params[:post][:new_attachments]
    attachments = attachments.values if attachments.is_a?(ActionController::Parameters)

    if attachments.present?
      attachments.each do |file|
        @post.files.attach(file)
      end
    end

    # 2. Normaliser les accesses
    accesses = params[:post][:accesses]
    accesses = accesses.values if accesses.is_a?(ActionController::Parameters)
    accesses ||= []

    accesses.each do |level|
      next if level['value'].blank?

      @post.accesses.build(
        level: level['value'],
        can_access: true
      )
    end

    # 3. Sauvegarde finale
    if @post.save
      render json: { status: 200, post: @post }
    else
      render json: { status: 422, errors: @post.errors }
    end
  end

  def update
      # Normaliser en array
    attachments = []
    attachments = params[:post][:new_attachments]
    attachments = attachments.values if attachments.is_a?(ActionController::Parameters)
    
    if attachments.present?
      # Attacher les fichiers
      attachments.each do |file|
        @post.files.attach(file)
      end
    end

    existing_attachments = params[:post][:existing_attachments]
    existing_ids = if existing_attachments.present?
                    existing_attachments.values.map { |h| h["id"].to_i }
                  else
                    []
                  end
    @post.files.each do |file|
      file.purge unless existing_ids.include?(file.id)
    end

    accesses = params[:post][:accesses]
    accesses = accesses.values if accesses.is_a?(ActionController::Parameters)
    if accesses.blank?
      accesses = []
    end
    accesses.each do |level|
      @post.accesses.find_or_create_by(level: level['value'], can_access: true) unless level['value'].blank?
    end

    @post.accesses.where.not(level: accesses.map { |l| l['value'] }).destroy_all

    if @post.update(post_params)
      render json: { status: 200, post: @post }
    else
      render json: { status: 422, errors: @post.errors }
    end
  end

  def destroy
    @post.destroy
    render json: { status: 200 }
  end

  private

  def set_post
    @post = Post.find(params.permit(:id)[:id])
  end

  def post_params
    params[:post].permit(:title, :structure_id, :content, :pinned, :published_at, :expired_at)
  end

end