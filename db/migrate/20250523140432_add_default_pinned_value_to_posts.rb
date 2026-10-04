class AddDefaultPinnedValueToPosts < ActiveRecord::Migration[6.1]
  def change
    change_column_default :posts, :pinned, from: nil, to: false
    add_index :posts, :pinned
  end
end
