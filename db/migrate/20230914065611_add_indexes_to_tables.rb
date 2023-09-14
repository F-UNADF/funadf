class AddIndexesToTables < ActiveRecord::Migration[6.1]
  def change
    add_index :campaigns, :meeting_id
    add_index :careers, :referent_id
    add_index :categories, :structure_id
    add_index :marriages, :husband_id
    add_index :marriages, :wife_id
  end
end
