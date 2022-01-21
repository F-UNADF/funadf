class CreateMemberships < ActiveRecord::Migration[6.1]
  def change
    create_table :memberships do |t|
      t.references :role, foreign_key: true, type: :integer
      t.references :structure, foreign_key: true, type: :integer
      t.references :user, foreign_key: true, type: :integer

      t.timestamps
    end
  end
end
