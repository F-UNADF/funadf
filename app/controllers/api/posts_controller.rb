class Api::PostsController < ApiController
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    posts = Post
      .includes(:structure)

    if params[:search].present?
      posts = posts.joins(:structure).where(
        "title LIKE :q OR content LIKE :q OR structures.name LIKE :q",
        q: "%#{params[:search]}%"
      )
    end

    render json: {posts: posts.as_json(include: ['structure'])}
  end

  def show
    files_data = @post.files.map do |file|
      {
        id:   file.id,
        name: file.filename.to_s,
        url:  url_for(file)
      }
    end
    post = @post.as_json.merge(
      images: @post.images.map { |image| url_for(image) },
      attachments: files_data,
      structure: @post.structure.as_json
    )

    render json: { post: post, files: files_data, accesses: @post.accesses.pluck(:level) }
  end

  def create
    post = Post.new(post_params)

    if @structure.present?
      post.structure_id = @structure.id
    end

    if post.save
      params[:files]&.each do |file|
        post.files.attach(file)
      end

      params[:post][:accesses].each do |level|
        post.accesses.find_or_create_by(level: level[1], can_access: true)
      end

      render json: { status: 200, post: post }
    else
      render json: { status: 422, errors: post.errors }
    end
  end

  def update

    if @structure.present?
      @post.structure_id = @structure.id
    end

    params[:files]&.each do |file|
      @post.files.attach(file)
    end

    params[:post][:accesses].each do |level|
      @post.accesses.find_or_create_by(level: level[1], can_access: true)
    end
    @post.accesses.where.not(level: params[:post][:accesses].values).destroy_all

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
    params[:post].permit(:title, :structure_id, :content, :pinned)
  end

end