module UiConfig
  class StructuresConfig < BaseConfig
    def initialize(type)
      @type = type # "regions", "churches", "associations"
    end

    def call
      {
        toolbarActions: toolbar_add(@type),
        itemActions: item_crud(@type),
        form: {
          fullscreen: true,
          defaultItem: new_structure,
          tabs: [
            infos_tab,
            members_tab
          ]
        }
      }
    end

    private

    def new_structure
      Structure.new
    end

    def infos_tab
      tab(
        title: "Information générale",
        name: "infos",
        fields: infos_fields
      )
    end

    def members_tab
      conditional_tab(
        title: "Membres",
        name: "members",
        condition: %w[id != null],
        fields: members_fields
      )
    end

    def infos_fields
      [
        { name: "logo", type: "file", label: "Logo" },
        { name: "name", type: "text", label: "Nom", rules: %w[required] },
        { name: "address_1", type: "text", label: "Adresse" },
        { name: "address_2", type: "text", label: "Complément d'adresse" },
        { name: "zipcode", type: "text", label: "Code postal", rules: %w[required], grid: 6 },
        { name: "town", type: "text", label: "Ville", rules: %w[required], grid: 6 },
        { name: "phone_1", type: "text", label: "Téléphone" },
        { name: "email", type: "text", label: "Email", rules: %w[email] },
        { name: "website", type: "text", label: "Site web" }
      ]
    end

    def members_fields
      [
        { name: "members", type: "members", label: "Membres" }
      ]
    end
  end
end
