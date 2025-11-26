module UiConfig
  class BaseConfig
    # Actions pour la toolbar
    def toolbar_add(scope)
      [
        { name: "add", title: "#{scope}.add", icon: "mdi-plus", action: "add" }
      ]
    end

    # Actions pour les items (edit + delete)
    def item_crud(scope)
      [
        { name: "edit", title: "#{scope}.edit", icon: "mdi-pencil", action: "edit" },
        { name: "delete", title: "#{scope}.delete", icon: "mdi-delete", action: "delete" }
      ]
    end

    # Helper tab générique
    def tab(title:, name:, fields:)
      {
        title: title,
        name: name,
        fields: fields
      }
    end

    # Gestion d’un tab conditionnel
    def conditional_tab(title:, name:, condition:, fields:)
      {
        title: title,
        name: name,
        if: condition,
        fields: fields
      }
    end
  end
end
