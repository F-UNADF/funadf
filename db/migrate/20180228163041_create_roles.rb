class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.string :name
      t.references :resource, polymorphic: true

      t.timestamps
    end

    create_table :rolizations do |t|
      t.references :role
      t.references :resource, polymorphic: true

      t.timestamps
    end
  end
end
