class AddNotifiedAtToNotifications < ActiveRecord::Migration[6.1]
  def change
    add_column :notifications, :notified_at, :datetime
  end
end
