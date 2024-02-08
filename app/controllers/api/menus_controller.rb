class Api::MenusController < ApiController

  def show
    menu = params[:menu]
    result = {}
    if current_user.nil?
      result[:error] = "User not found"
      render json: result
      return
    end
    case menu
    when 'admin'
      ## ADMINISTRATION ADD ##
      result = [
        {
          header: "ADMIN",
        }
      ]
      if current_user.is_admin? || current_user.has_role?(:moderator)
        result << {
          title: "Utilisateurs",
          icon: "mdi-account-group",
          to: admin_users_path,
        }
      end

      if current_user.is_admin?
        result <<
          {
            title: "Eglises",
            icon: "mdi-church",
            to: admin_churches_path,
          }
      end

      if current_user.is_admin? || current_user.has_any_role?(:president, :treasurer, :secretary)
        result <<
          {
            title: "Associations",
            icon: "mdi-office-building",
            to: admin_associations_path,
          }
        result <<
          {
            title: "Campagnes",
            icon: "mdi-vote",
            to: admin_campaigns_path,
          }
      end

      if current_user.is_admin?
        result << {
          title: "Agenda",
          icon: "mdi-calendar",
          to: admin_events_path,
        }
        result <<
          {
            title: "Actu",
            icon: "mdi-newspaper",
            to: admin_posts_path,
          }
      end

      ## PARAMETTRAGE APPLICATION ##
      result <<
        {
          header: "PARAMETRAGE",
        }
      result <<
        {
          title: 'Roles',
          icon: 'mdi-account-key',
          to: admin_roles_path,
        }

      ## NAVIGATION ##
      result <<
        {
          header: "NAVIGATION",
        }
      result <<
        {
          title: "Mon espace",
          icon: "mdi-rss",
          href: me_me_url(subdomain: :me),
        }
      result <<
        {
          title: "Espace de votes",
          icon: "mdi-vote",
          href: root_url(subdomain: ''),
        }
    when 'votes'
      result = [
        {
          header: "VOTES",
        },
        {
          title: "Mes votes",
          icon: "mdi-vote",
          to: votes_campaigns_path,
        },
        {
          header: "NAVIGATION",
        },
        {
          title: "Mon espace",
          icon: "mdi-rss",
          href: me_me_url(subdomain: :me),
        },
      ]
    when 'me'
      result = [
        {
          header: "MON ESPACE",
        },
        {
          title: "Feed",
          icon: "mdi-newspaper",
          to: me_feed_path,
        },
      ]
    when /test|uadpif|urb/
      result = [
        {
          header: "INTRANET",
        },
        {
          title: "Actu",
          icon: "mdi-newspaper",
          to: intranet_posts_path,
        },
        {
          title: "Agenda",
          icon: "mdi-calendar",
          to: intranet_events_path,
        },
        {
          title: "Pasteurs",
          icon: "mdi-account-group",
          to: intranet_users_path,
        },
        {
          title: "Eglises",
          icon: "mdi-church",
          to: intranet_churches_path,
        },
        {
          title: "Campagnes",
          icon: "mdi-vote",
          to: intranet_campaigns_path,
        },
        {
          header: "NAVIGATION",
        },
        {
          title: "Mon espace",
          icon: "mdi-rss",
          href: me_me_url(subdomain: :me),
        },
        {
          title: "Espace de votes",
          icon: "mdi-vote",
          href: root_url(subdomain: ''),
        },
      ]
    else
      result[:error] = "Menu #{menu} not found"
    end

    Intranet.order(:subdomain).each do |intranet|
      if can? :manage, intranet
        # insert header INTRANET if not present
        result << { header: "INTRANET" } unless result.any? { |h| h[:header] == "INTRANET" }
        result << {
          title: intranet.structure_name,
          icon: "mdi-rss",
          href: root_url(subdomain: intranet.subdomain),
        }
      end
    end

    if current_user.is_admin?
      result << {
        header: "ADMIN",
      }
      result << {
        title: "Admin",
        icon: "mdi-cog",
        href: admin_root_url(subdomain: :admin),
      }
    end

    render json: result
  end
end
