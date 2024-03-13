class CreateBackups < ActiveRecord::Migration[6.1]
  def change
    create_table :backups do |t|
      t.string :name

      t.timestamps
    end
  end
end
