class Api::MenusController < ApiController

  def show
    menu   = params[:menu]
    result = {}
    case menu
    when 'admin'
      result = [
        {
          header: "ADMIN",
        },
        {
          title: "Accueil",
          icon:  "mdi-home",
          to:    admin_root_path,
        },
        {
          title: "Utilisateurs",
          icon:  "mdi-account-group",
          to:    admin_users_path,
        },
        {
          title: "Eglises",
          icon:  "mdi-church",
          to:    admin_churches_path,
        },
        {
          title: "Associations",
          icon:  "mdi-office-building",
          to:    admin_associations_path,
        },
        {
          title: "Campagnes",
          icon:  "mdi-vote",
          to:    admin_campaigns_path,
        },
        {
          header: "NAVIGATION",
        },
        {
          title: "Mon espace",
          icon:  "mdi-rss",
          href:  me_me_url(subdomain: :me),
        },
        {
          title: "Espace de votes",
          icon:  "mdi-vote",
          href:  root_url(subdomain: ''),
        },
      ]
    else
      result[:error] = "Menu #{menu} not found"
    end

    render json: result
  end
end
