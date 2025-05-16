class Api::ConfigController < ApiController

  def show
    config = {}
    model = params[:model]
    case model
    when "regions"
      # on ajoute les fields de la region pour le form
      config[:form] = {
        fullscreen: false,
        maxWidth: "50%",
        defaultItem: Region.new,
        tabs: [
          {
            name: "Information générale",
        fields: [
          { name: "logo", type: "file", label: "Logo" },
          { name: "name", type: "text", label: "Nom" },
          { name: "address_1", type: "text", label: "Adresse" },
          { name: "address_2", type: "text", label: "Complément d'adresse" },
          { name: "zipcode", type: "text", label: "Code postal", grid: 6 },
          { name: "town", type: "text", label: "Ville", grid: 6 },
          { name: "phone_1", type: "text", label: "Téléphone" },
          { name: "email", type: "text", label: "Email" }
        ]
          }
        ]
      }
    end

    return render json: { config: config }
  end
end
