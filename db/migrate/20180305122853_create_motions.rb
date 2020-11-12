class CreateMotions < ActiveRecord::Migration
  def change
    create_table :motions do |t|
      t.references :campaign, index: true
      t.integer :order
      t.string :name
      t.string :kind

      t.timestamps
    end
  end
end
