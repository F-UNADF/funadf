class AddIsConsultativeToVotes < ActiveRecord::Migration
  def change
    add_column :votes, :is_consultative, :boolean
  end
end
