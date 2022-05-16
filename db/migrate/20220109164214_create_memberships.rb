class CreateMemberships < ActiveRecord::Migration[6.1]
  def change
    create_table :memberships do |t|
      t.references :role, foreign_key: true, type: :integer

      t.references :member, polymorphic: true #le membre de
      t.references :structure #l'asso

      t.timestamps
    end
  end
end
