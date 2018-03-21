class AddResourceToVoters < ActiveRecord::Migration
  def change
    remove_column :voters, :user_id
    add_reference :voters, :resource, polymorphic: true
  end
end
