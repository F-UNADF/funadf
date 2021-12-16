class Me::FeedController < MeController


  def index
    my_structures = current_user.structures

    @posts = Post.where(structure_id: my_structures.pluck(:id)).joins(:accesses).where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level).order(created_at: :desc)
  end


end