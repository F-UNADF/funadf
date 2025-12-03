class AddPublishedAtToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :published_at, :datetime
    add_column :posts, :expired_at, :datetime

    reversible do |dir|
      dir.up do
        execute <<~SQL
          UPDATE posts
          SET published_at = created_at;
        SQL
      end
    end
  end
end
