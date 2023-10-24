class Me::FeedController < MeController

  def show
  end
  def index
    @posts = Post.where(structure_id: @my_structures.pluck(:id)).joins(:accesses).where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level).order(created_at: :desc)
    respond_to do |format|
      format.html{
        @posts = @posts.paginate(:page => params[:page], per_page: 10)
      }
      format.js{
        @results = @posts.where('title LIKE ? OR content LIKE ?', "%#{params[:query]}%", "%#{params[:query]}%").limit(10)
      }
    end
  end


end