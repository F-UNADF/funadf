class Api::PostsController < ApiController
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    if @structure.nil?
      posts = Post.order(id: :desc)
    else
      posts = @structure.posts.order(id: :desc)
    end
    render json: { posts: posts }
  end

  def show
    files_data = @post.files.map do |file|
      {
        id:   file.id,
        name: file.filename.to_s,
        url:  url_for(file)
      }
    end
    render json: { post: @post, files: files_data, accesses: @post.accesses.pluck(:level) }
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
    @post = Post.find(params[:id])
  end

  def post_params
    params[:post].permit(:title, :structure_id, :content)
  end

end