class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|
      t.string :file
      t.boolean :has_heading

      t.timestamps
    end
  end
end
