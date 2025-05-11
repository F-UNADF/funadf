class CreateDeviceTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :device_tokens do |t|
      t.references :user, foreign_key: true, type: :integer
      t.string :token
      t.string :platform

      t.timestamps
    end
  end
end
