class Motion < ActiveRecord::Base

  belongs_to :campaign

  has_many :voters, dependent: :destroy
  has_many :votes, dependent: :destroy

  def has_voted? elector
    voters.pluck(:elector_id).include?(elector.id) || voters.pluck(:resource_id, :resource_type).include?([elector.id, elector.get_class])
  end

  def self.kinds
    {
      "Oui / Non" => "binary" ,
      "Oui / Non / Neutre" => "neutral",
      "Texte libre" => "free"
    }
  end
end
