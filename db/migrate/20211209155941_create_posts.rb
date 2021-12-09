class CreatePosts < ActiveRecord::Migration[4.2]
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.references :structure, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
