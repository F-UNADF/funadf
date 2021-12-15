class CreateGratitudes < ActiveRecord::Migration[6.1]
  def change
    create_table :gratitudes do |t|

      t.string :level
      t.integer :referent_id
      t.date :start_at
      t.date :end_at

      t.timestamps
    end

    add_reference :gratitudes, :user, index: true
  end
end
