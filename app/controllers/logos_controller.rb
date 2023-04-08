class LogosController < ApplicationController
  def show
    if params[:structure] != "undefined"
      structure = Structure.find(params[:structure])
      if structure.logo.attached?
        redirect_to structure.logo.variant(resize_to_fill: [500, 500])
      else
        redirect_to "https://fakeimg.pl/500x500/?retina=1&text=" + structure.name
      end
    else
      redirect_to "https://fakeimg.pl/500x500/?retina=1&text=Logo"
    end
  end
end