class CreateAccesses < ActiveRecord::Migration[6.1]
  def change
    create_table :accesses do |t|
      t.references :resource, polymorphic: true
      t.string :level
      t.boolean :can_access

      t.timestamps
    end
  end
end
