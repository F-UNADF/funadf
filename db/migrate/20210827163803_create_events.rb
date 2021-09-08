class CreateEvents < ActiveRecord::Migration
  def change
    create_table :events do |t|
      t.string :title
      t.string :description
      t.datetime :start_at
      t.datetime :end_at
      t.string :category

      t.timestamps null: false
    end
  end
end
