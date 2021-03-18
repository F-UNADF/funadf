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


end
