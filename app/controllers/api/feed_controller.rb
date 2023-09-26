class Api::FeedController < ApiController

  def index
    posts = Post.joins(:accesses, :structure)
                .where(structure_id: current_user.memberships.pluck(:structure_id))
                .where('accesses.level = ? AND accesses.can_access = TRUE', current_user.level)
                .order(created_at: :desc)

    post_with_urls = posts.map do |post|
      {
        post: post,
        structure: post.structure,
        structure_logo_url: Rails.application.routes.url_helpers.rails_blob_url(post.structure.logo, only_path: true)
      }
    end

    render json: { posts: post_with_urls }
  end

end