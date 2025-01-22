class AddLongitudeLatitudeToStructures < ActiveRecord::Migration[6.1]
  def change
    add_column :structures, :longitude, :float, precision: 10, scale: 6
    add_column :structures, :latitude, :float, precision: 10, scale: 6
  end
end
