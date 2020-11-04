class VotingTable < ActiveRecord::Base
  belongs_to :campaign

  def self.get_votings
    {
      'Ne vote pas' => :not,
      'vote comptabilisé' => :count,
      'vote Consultatif' => :consultative
    }
  end
end
