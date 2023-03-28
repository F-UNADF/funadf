class AvatarsController < ApplicationController
  def show
    user = User.find(params[:user])
    if user.avatar.attached?
      redirect_to user.avatar.url
    else
      redirect_to 'https://www.gravatar.com/avatar/' + Digest::MD5.hexdigest(user.email.downcase) + '?s=200&d=mm'
    end
  end
end