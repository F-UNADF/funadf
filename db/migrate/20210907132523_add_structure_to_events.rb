class AddStructureToEvents < ActiveRecord::Migration
  def change
    add_reference :events, :structure, index: true, foreign_key: true
  end
end
