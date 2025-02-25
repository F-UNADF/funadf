class CreateDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :documents do |t|
      t.string :name
      t.text :description
      t.string :url

      t.references :category, index: true, foreign_key: true, type: :integer

      t.timestamps
    end
  end
end
