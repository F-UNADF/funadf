class DropOldTables < ActiveRecord::Migration[6.1]
  def up
    drop_table :notifications, if_exists: true
    drop_table :marriages, if_exists: true
    drop_table :intranets, if_exists: true
    drop_table :attendees, if_exists: true
    drop_table :meetings, if_exists: true
  end

  def down
    # No need to recreate the tables as they are not used anymore
  end

end
