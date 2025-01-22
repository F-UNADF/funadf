class RemoveRolizations < ActiveRecord::Migration[6.1]
  def change
    drop_table :rolizations
  end
end
