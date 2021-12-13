class Me::FeedController < MeController


  def index
    my_structures = current_user.structures

    @posts = Post.where(structure_id: my_structures.pluck(:id)).order(created_at: :desc)
  end


end