class CreateStructures < ActiveRecord::Migration
  def change
    create_table :structures do |t|
      t.string :name
      t.string :address_1
      t.string :address_2
      t.string :zipcode
      t.string :town
      t.string :phone_1
      t.string :phone_2
      t.string :type

      t.timestamps
    end
  end
end
