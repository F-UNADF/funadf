class CreateAttendees < ActiveRecord::Migration[6.1]
  def change
    create_table :attendees do |t|
      t.references :user
      t.references :meeting

      t.timestamps
    end
  end
end
