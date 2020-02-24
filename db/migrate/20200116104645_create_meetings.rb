class CreateMeetings < ActiveRecord::Migration
  def change
    create_table :meetings do |t|
      t.string :name
      t.date :begin_at
      t.date :end_at
      t.text :description

      t.timestamps null: false
    end
  end
end
