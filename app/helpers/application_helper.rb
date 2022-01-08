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

  def custom_bootstrap_flash
    flash_messages = []
    flash.each do |type, message|
      type = :success if type == 'notice'
      type = :error   if type == 'alert'
      text = "<script>toastr.#{type}(\"#{message}\");</script>"
      flash_messages << text.html_safe if message
    end
    flash_messages.join("\n").html_safe
  end

  def get_structure_logo_link(s, resize=[100, 100])
    if s.logo.attached?
      s.logo.representation(resize_to_limit: resize)
    else
      s.gravatar_url
    end
  end


end
