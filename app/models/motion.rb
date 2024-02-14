class Motion < ActiveRecord::Base

  belongs_to :campaign

  has_many :voters, dependent: :delete_all
  has_many :votes, dependent: :delete_all

  def has_voted? elector
    elector && (voters.pluck(:resource_id, :resource_type).include?([elector.id, elector.get_class]))
  end
end
