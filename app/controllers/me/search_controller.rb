class Me::SearchController < MeController

  def index
    # Resultats de la recherche en remote


    respond_to do |format|
      format.js {
        query = params[:query]
        @users = User.where('lastname LIKE ? OR firstname LIKE ? OR zipcode LIKE ? OR town LIKE ?', "#{query}%", "#{query}%", "#{query}%", "#{query}%")
        @structures = Structure.where('name LIKE ? OR zipcode LIKE ? OR town LIKE ?', "#{query}%", "#{query}%", "#{query}%")

        @results = (@users + @structures).sort_by{|m| m.name}
      }
    end
  end


  def show
    #page recherche

  end



end