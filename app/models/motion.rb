class Motion < ActiveRecord::Base

  belongs_to :campaign

  has_many :voters
  has_many :votes

  def has_voted? elector
    voters.pluck(:elector_id).include?(elector.id) || voters.pluck(:user_id).include?(elector.id)
  end

  def self.kinds
    {
      "Oui / Non" => "binary" ,
      "Oui / Non / Neutre" => "neutral",
      "Texte libre" => "free"
    }
  end
end
