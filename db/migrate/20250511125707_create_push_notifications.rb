class CreatePushNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :push_notifications do |t|
      t.string :title
      t.string :body
      t.string :url
      t.datetime :sent_at

      t.timestamps
    end
  end
end
