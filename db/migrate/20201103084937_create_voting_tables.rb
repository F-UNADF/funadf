class CreateVotingTables < ActiveRecord::Migration
  def change
    create_table :voting_tables do |t|
      t.references :campaign, index: true, foreign_key: true
      t.string :position
      t.string :voting
      t.boolean :as_member

      t.timestamps null: false
    end
  end
end
