class CreateNotifications < ActiveRecord::Migration[6.1]
  def change
    create_table :notifications do |t|
      t.references :recipient, polymorphic: true, index: true
      t.references :sender, polymorphic: true, index: true
      t.references :notifiable, polymorphic: true, index: true
      t.string :action
      t.boolean :read

      t.timestamps
    end
  end
end
