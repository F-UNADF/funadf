class Motion < ActiveRecord::Base

  belongs_to :campaign


  def self.kinds
    {
      "Oui / Non" => "binary" ,
      "Oui / Non / Neutre" => "neutral",
      "Texte libre" => "free"
    }
  end
end
