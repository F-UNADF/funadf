class CreateIntranets < ActiveRecord::Migration
  def change
    create_table :intranets do |t|
      t.string :subdomain
      t.references :structure, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
