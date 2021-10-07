class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name
      t.string :color
      t.string :kind

      t.references :structure

      t.timestamps null: false
    end

    add_reference :events, :category, index: true, foreign_key: true


  end
end
