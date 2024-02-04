class Api::SearchController < ApiController

  def index
    query = params[:query]
    
    # Search in the User model
    users = User.where('lastname LIKE ? OR firstname LIKE ? OR zipcode LIKE ? OR town LIKE ?', "#{query}%", "#{query}%", "#{query}%", "#{query}%")
    user_results = users.map do |user|
      {
        id: user.id,
        icon: 'person',
        name: "#{user.lastname} #{user.firstname}",
        phone: user.phone_1,
        email: user.email,
        zipcode: user.zipcode,
        town: user.town,
        photo_url: "#{root_url}avatars/#{user.id}.png", # Assuming avatar URLs are based on user ID
        model_type: 'users'
      }
    end

    # Search in the Structure model
    churches = Church.where('name LIKE ? OR zipcode LIKE ? OR town LIKE ?', "#{query}%", "#{query}%", "#{query}%")
    church_results = churches.map do |structure|
      {
        id: structure.id,
        icon: 'home',
        name: structure.name,
        phone: structure.phone_1,
        email: structure.email,
        zipcode: structure.zipcode,
        town: structure.town,
        photo_url: "#{root_url}logos/#{structure.id}.png", # Assuming logo URLs are based on structure ID
        model_type: 'churches'
      }
    end

    # Search in the Structure model
    associations = Association.where('name LIKE ? OR zipcode LIKE ? OR town LIKE ?', "#{query}%", "#{query}%", "#{query}%")
    association_results = associations.map do |structure|
      {
        id: structure.id,
        icon: 'business',
        name: structure.name,
        phone: structure.phone_1,
        email: structure.email,
        zipcode: structure.zipcode,
        town: structure.town,
        photo_url: "#{root_url}logos/#{structure.id}.png", # Assuming logo URLs are based on structure ID
        model_type: 'associations'
      }
    end

    # Combine and sort the results
    results = (user_results + association_results + church_results).sort_by { |m| m[:name] }


    render json: results
  end


end