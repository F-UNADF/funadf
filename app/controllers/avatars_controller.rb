class AvatarsController < ApplicationController
  def show
    if params[:id] != "undefined"
      user = User.find(params[:id])
      if user.avatar.attached?
        redirect_to url_for(user.avatar.variant(resize_to_fill: [500, 500]))
      else
        u = user.fullname.split.map { |word| word[0] }.join
        redirect_to "https://fakeimg.pl/500x500/?retina=1&text="+u
      end
    else
      redirect_to "https://fakeimg.pl/500x500/?retina=1&text=Avatar"
    end
  end
end