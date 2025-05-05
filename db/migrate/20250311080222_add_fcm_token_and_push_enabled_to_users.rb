class AddFcmTokenAndPushEnabledToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :fcm_token, :string
    add_column :users, :push_enabled, :boolean
  end
end
