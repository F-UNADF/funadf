class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes, id: false do |t|
      t.references :motion, index: true
      t.string :result
    end
  end
end
