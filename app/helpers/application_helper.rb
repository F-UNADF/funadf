module ApplicationHelper

  def ldate(dt, hash = {})
    dt ? l(dt, hash) : ""
  end

  def reasons_for_select
    {
      "Non renseigné" => :nil,
      "Pas d'émargement" => :signing,
      "Problème de cotisation" => :contribution
    }
  end

  def state_for_select
    {
      "A venir" => :coming,
      "Ouverte" => :opened,
      "Cloturée" => :closed
    }
  end

  def categories_for_events
    ["Réseau", "Ressource", "Plénière", "National", "Divers"]
  end

  def get_url intranet
    "#{intranet.subdomain}.#{Rails.application.secrets.app_domain}"
  end


end
