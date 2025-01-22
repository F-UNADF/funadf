class AddMaxChoiceToMotions < ActiveRecord::Migration[6.1]
  def change
    add_column :motions, :max_choice, :integer, default: 1, size: 1
  end
end
