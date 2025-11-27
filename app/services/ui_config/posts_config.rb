module UiConfig
  class PostsConfig < BaseConfig
    def call
      {
        toolbarActions: toolbar_add("posts"),
        itemActions: item_crud("posts"),
        form: {
          fullscreen: true,
          defaultItem: Post.new,
          tabs: [
            infos_tab
          ]
        }
      }
    end

    private

    def infos_tab
      tab(
        title: "Information générale",
        name: "infos",
        fields: infos_fields
      )
    end

    def infos_fields
      structures = Structure.where.not(type: 'Church').all.map do |structure|
        { value: structure.id, title: structure.name }
      end
      levels = User.get_levels.map do |level|
        { value: level, title: level.humanize }
      end
      [
        { name: "title", type: "text", label: "Titre", rules: %w[required] },
        { name: "structure_id", type: "select_one", grid: 6, items: structures },
        { name: "pinned", type: "bool", grid: 6 },
        { name: "content", type: "wysiwyg" },
        { name: "existing_attachments", type: "list_files", grid: 6 },
        { name: "new_attachments", type: "files", grid: 6 },
        { name: "accesses", type: "select_multiple", items: levels },
      ]
    end
  end
end
