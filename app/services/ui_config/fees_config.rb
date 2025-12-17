module UiConfig
  class FeesConfig < BaseConfig
    def initialize
      @type = "fees"
    end

    def call
      {
        toolbarActions: toolbar_add(@type),
        itemActions: item_crud(@type),
        form: {
          fullscreen: false,
          defaultItem: new_fee,
          tabs: [
            infos_tab,
          ]
        }
      }
    end

    private

    def new_fee
      Fee.new
    end

    def infos_tab
      tab(
        title: "Information générale",
        name: "infos",
        fields: infos_fields
      )
    end

    def infos_fields
      members = User.enabled.map do |user|
        { value: "User-#{user.id}", title: "#{user.lastname} #{user.firstname}" }
      end
      years = (Date.today.year - 5..Date.today.year + 1).to_a.reverse.map do |year|
        { value: year, title: year.to_s }
      end
      [
        { name: "what", type: "select_one", label: "Année", rules: %w[required], items: years },
        { name: "paid_at", type: "date", label: "Payée le" },
        { name: "amount", type: "float", label: "Montant" },
        { name: "member", type: "autocomplete_one", items: members },
      ]
    end
  end
end
