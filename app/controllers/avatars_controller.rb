class AvatarsController < ApplicationController
  def show
    user = User.find(params[:user])
    if user.avatar.attached?
      send_data user.avatar.variant(resize_to_fill: [500, 500])
    else
      send_data 'https://www.gravatar.com/avatar/' + Digest::MD5.hexdigest(user.email.downcase) + '?s=200&d=mm'
    end
  end
end