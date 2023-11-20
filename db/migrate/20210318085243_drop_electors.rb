class DropElectors < ActiveRecord::Migration
  def change
    drop_table :electors

    remove_column :voters, :elector_id
  end
end
