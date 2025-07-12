class Api::ConfigController < ApiController

    def show
        config = {}
        model  = params[:model]
        case model
            when "regions"
                # on ajoute les fields de la region pour le form
                config[:toolbarActions] = [
                    { name: "add", title: "regions.add", icon: "mdi-plus", action: "add" },
                ]
                config[:itemActions]    = [
                    { name: "edit", title: "regions.edit", icon: "mdi-pencil", action: "edit" },
                    { name: "delete", title: "regions.delete", icon: "mdi-delete", action: "delete" },
                ]
                config[:form]           = {
                    fullscreen:  true,
                    defaultItem: Region.new,
                    tabs:        [{
                        title:  "Information générale",
                        name:   "infos",
                        fields: [
                                    { name: "logo", type: "file", label: "Logo" },
                                    { name: "name", type: "text", label: "Nom", rules: %w[required] },
                                    { name: "address_1", type: "text", label: "Adresse" },
                                    { name: "address_2", type: "text", label: "Complément d'adresse" },
                                    { name: "zipcode", type: "text", label: "Code postal", rules: %w[required], grid: 6 },
                                    { name: "town", type: "text", label: "Ville", rules: %w[required], grid: 6 },
                                    { name: "phone_1", type: "text", label: "Téléphone" },
                                    { name: "email", type: "text", label: "Email", rules: %w[email] },
                                    { name: "website", type: "text", label: "Site web" },
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
            when "churches"
                # on ajoute les fields de la region pour le form
                config[:toolbarActions] = [
                    { name: "add", title: "churches.add", icon: "mdi-plus", action: "add" },
                ]
                config[:itemActions]    = [
                    { name: "edit", title: "churches.edit", icon: "mdi-pencil", action: "edit" },
                    { name: "delete", title: "churches.delete", icon: "mdi-delete", action: "delete" },
                ]
                config[:form]           = {
                    fullscreen:  true,
                    defaultItem: Church.new,
                    tabs:        [{
                        title:  "Information générale",
                        name:   "infos",
                        fields: [
                                    { name: "logo", type: "file", label: "Logo" },
                                    { name: "name", type: "text", label: "Nom", rules: %w[required] },
                                    { name: "address_1", type: "text", label: "Adresse" },
                                    { name: "address_2", type: "text", label: "Complément d'adresse" },
                                    { name: "zipcode", type: "text", label: "Code postal", rules: %w[required], grid: 6 },
                                    { name: "town", type: "text", label: "Ville", rules: %w[required], grid: 6 },
                                    { name: "phone_1", type: "text", label: "Téléphone" },
                                    { name: "email", type: "text", label: "Email", rules: %w[email] },
                                    { name: "website", type: "text", label: "Site web" },
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
