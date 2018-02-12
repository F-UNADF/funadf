class CreateMemberships < ActiveRecord::Migration
  def change
    create_table :memberships do |t|
      t.references :is_memberable, index: true, polymorphic: true
      t.references :has_memberable, index: true, polymorphic: true

      t.string :kind

      t.timestamps
    end
  end
end
