class AddNoteToElectors < ActiveRecord::Migration
  def change
    add_column :electors, :note, :text
  end
end
