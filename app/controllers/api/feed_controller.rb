class Api::FeedController < ApiController

  def index
    # set offset to 0 if not present
    offset = params[:offset] || 0
    posts = Post.joins(:accesses, :structure)
                .where(structure_id: current_user.memberships.pluck(:structure_id))
                .where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level)
                .order(created_at: :desc)
                .limit(10)
                .offset(offset)

    if params[:search].present?
      posts = posts.where('posts.title LIKE ? OR posts.content LIKE ?', "%#{params[:search]}%", "%#{params[:search]}%")
    end

    post_with_urls = posts.map do |post|
      {
        post:               post,
        images:             post.images.map { |image| url_for image },
        attachments:        post.attachments.map { |file| url_for file },
        structure:          post.structure,
      }
    end

    render json: { posts: post_with_urls }
  end

end