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
        result <<
          {
            title: "Associations",
            icon: "mdi-office-building",
            to: admin_associations_path,
          }
        result <<
          {
            title: "Regions",
            icon: "mdi-map-marker-account",
            to: admin_regions_path,
          }
        result <<
          {
            title: "Campagnes",
            icon: "mdi-vote",
            to: admin_campaigns_path,
          }
        result <<
          {
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
        result <<
          {
            title: "Cotisations",
            icon: "mdi-wallet",
            to: admin_fees_path,
          }
        result <<
          {
            title: "Documents",
            icon: "mdi-folder-open",
            to: admin_documents_path,
          }
        result <<
          {
            title: "Notifications",
            icon: "mdi-message",
            to: admin_push_notifications_path,
          }


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
      end

      ## NAVIGATION ##
      result <<
        {
          header: "NAVIGATION",
        }

      result <<
        {
          title: "Mon espace",
          icon: "mdi-rss",
          href: root_url,
        }
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
        {
          title: "Mon profil",
          icon: "mdi-account",
          to: me_me_path,
        },
        {
          title: "Annuaire",
          icon: "mdi-card-account-details-outline",
          to: me_annuaire_path,
        },
        {
          title: "Documents",
          icon: "mdi-folder-outline",
          to: me_documents_path,
        },
        {
          title: "Votes",
          icon: "mdi-vote",
          to: me_votes_path,
        }
      ]
    when 'association'
      result = [
        {
          header: "ASSOCIATION",
        },
        {
          title: "Mes associations",
          icon: "mdi-newspaper",
          to: association_associations_path,
        },
        {
          title: "Campagnes",
          icon: "mdi-vote",
          to: association_campaigns_path,
        },
      ]
    when 'region'
      result = [
        {
          header: "REGION",
        },
        {
          title: "Campagnes",
          icon: "mdi-vote",
          to: region_campaigns_path,
        },
        {
          title: "Membres",
          icon: "mdi-account-group",
          to: region_members_path,
        },
        {
          title: "Evènements",
          icon: "mdi-calendar",
          to: region_events_path,
        },
        {
          title: "Actu",
          icon: "mdi-newspaper",
          to: region_posts_path,
        },
        {
          header: "NAVIGATION",
        },
        {
          title: "Mon espace",
          icon: "mdi-rss",
          href: root_url,
        },
      ]
    else
      result[:error] = "Menu #{menu} not found"
    end

    if !result.include?(:error) && (
      current_user.is_admin? || 
      current_user.associations_responsabilities.any? || 
      current_user.regions_responsabilities.any?)

      result << {
        header: "ADMIN",
      }
      if current_user.is_admin?
        result << {
          title: "Admin",
          icon: "mdi-cog",
          href: admin_users_url,
        }
      end
      if !current_user.associations_responsabilities.blank?
        result << {
          title: "Association",
          icon: "mdi-domain",
          href: association_associations_path,
        }
      end
      if !current_user.regions_responsabilities.blank?
        result << {
          title: "Region",
          icon: "mdi-map-marker-account",
          href: region_members_url,
        }
      end
    end

    render json: result
  end
end
