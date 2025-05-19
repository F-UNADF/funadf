class Api::ConfigController < ApiController

    def show
        config = {}
        model  = params[:model]
        case model
            when "regions"
                # on ajoute les fields de la region pour le form
                config[:actions] = [
                    { name: "add", title: "regions.add", icon: "mdi-plus", action: "add" },
                ]
                config[:form] = {
                    fullscreen:  true,
                    maxWidth:    "50%",
                    defaultItem: Region.new,
                    tabs:        [
                                     {
                                         title:  "Information générale",
                                         name:   "infos",
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
                                     },
                                     {
                                         title:  "Membres",
                                         name:   "members",
                                         if:     %w[id != null],
                                         fields: [
                                                     { name: "members", type: "members", label: "Membres" },
                                                 ]
                                     },
                                 ]
                }
        end

        render json: { config: config }
    end
end
