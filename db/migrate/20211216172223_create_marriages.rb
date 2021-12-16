class CreateMarriages < ActiveRecord::Migration[6.1]
  def change
    create_table :marriages do |t|
      t.integer :husband_id, foreign_key: true
      t.integer :wife_id, foreign_key: true

      t.timestamps
    end
  end
end
