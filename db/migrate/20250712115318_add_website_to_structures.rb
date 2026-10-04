class AddWebsiteToStructures < ActiveRecord::Migration[6.1]
  def change
    add_column :structures, :website, :string
  end
end
