class Api::UsersController < ApplicationController
  def index
    users = User.joins(
      "LEFT JOIN (SELECT user_id, MAX(start_at) AS max_start_at
         FROM careers
         GROUP BY user_id
       ) latest_career ON users.id = latest_career.user_id"
    ).joins(
      "LEFT JOIN careers ON latest_career.user_id = careers.user_id AND latest_career.max_start_at = careers.start_at"
    ).select("users.*, COALESCE(careers.level, 'NR') AS current_level")

    render json: users
  end
end
