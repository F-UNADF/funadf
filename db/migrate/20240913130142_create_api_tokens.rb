class CreateApiTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :api_tokens do |t|
      t.references :user, foreign_key: true, type: :integer
      t.text :token
      t.boolean :active

      t.timestamps
    end
  end
end
