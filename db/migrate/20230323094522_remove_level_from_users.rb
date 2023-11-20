class RemoveLevelFromUsers < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :level, :integer
  end
end
