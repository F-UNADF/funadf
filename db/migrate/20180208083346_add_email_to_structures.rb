class AddEmailToStructures < ActiveRecord::Migration
  def change
    add_column :structures, :email, :string
  end
end
