class CreateSsoTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :sso_tokens do |t|
      t.references :user, foreign_key: true, type: :integer
      t.string :token, null: false
      t.datetime :expires_at, null: false
      t.datetime :used_at

      t.timestamps
    end

    add_index :sso_tokens, :token, unique: true
  end
end
