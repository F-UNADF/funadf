class RenameGratitudes < ActiveRecord::Migration[6.1]
  def change
    rename_table :gratitudes, :careers
  end
end
