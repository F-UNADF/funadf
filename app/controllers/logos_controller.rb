class LogosController < ApplicationController
  def show
    if params[:id] != "undefined"
      structure = Structure.find(params[:id])
      if structure.logo.attached?
        redirect_to url_for(structure.logo.variant(resize_to_fill: [500, 500]))
      else
        s = structure.name.split.map { |word| word[0] }.join
        redirect_to "https://fakeimg.pl/500x500/?retina=1&text="+s
      end
    else
      redirect_to "https://fakeimg.pl/500x500/?retina=1&text=Logo"
    end
  end
end