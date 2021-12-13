class Intranet::PostsController < IntranetController

  def index
    @posts = @intranet_structure.posts
  end

  def show
  end

  def new
    @post = @intranet_structure.posts.build
  end

  def edit
    @post = Post.find params[:id]
  end

  def create
    @post = Post.new(post_params)

    if @post.save
      redirect_to [:intranet, :posts], notice: 'Actualité créée'
    else
      render :new
    end
  end

  def update
    @post = Post.find params[:id]

    if @post.update(post_params)
      redirect_to [:intranet, :posts], flash:{success: 'Actualité mise à jour'}
     else
      render :edit
    end
  end

  def destroy
    @post = Post.find params[:id]

    @post.destroy

    redirect_to :back, flash:{success: 'Actualité supprimée'}
  end

  private

    def post_params
      params.require(:post).permit(:title, :content, :structure_id, files: [])
    end

end
