class AddPinnedToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :pinned, :boolean
  end
end
