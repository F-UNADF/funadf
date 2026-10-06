class Motion < ActiveRecord::Base

  belongs_to :campaign

  has_many :voters, dependent: :delete_all
  has_many :votes, dependent: :delete_all
end
