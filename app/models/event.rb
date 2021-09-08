class Event < ActiveRecord::Base

  belongs_to :structure

  def self.get_color category
    case category
    when "Réseau"
      "#DD0000"
    when "Ressource"
      "#00DD00"
    when "Plénière"
      "#00DDDD"
    when "National"
      "#0000DD"
    when "Divers"
      "#DD00DD"
    end
  end

end
