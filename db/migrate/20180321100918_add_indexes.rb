class AddIndexes < ActiveRecord::Migration
  def change
    add_index(:campaigns, :structure_id)
    add_index(:electors, [:resource_id, :resource_type])
    add_index(:roles, [:resource_id, :resource_type])
    add_index(:rolizations, :role_id)
    add_index(:rolizations, [:resource_id, :resource_type])
    add_index(:users, [:invited_by_id, :invited_by_type])
    add_index(:voters, [:resource_id, :resource_type])
  end
end
