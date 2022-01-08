class Me::FeedController < MeController


  def index
    my_structures = current_user.structures

    @posts = Post.where(structure_id: my_structures.pluck(:id)).joins(:accesses).where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level).order(created_at: :desc)
    @events = Event.where(structure_id: my_structures.pluck(:id)).where('start_at >= ?', DateTime.now).order(start_at: :desc).limit(5)
  end


end