class AddStructureToCareers < ActiveRecord::Migration[6.1]
  def change
    add_column :careers, :church_id, :integer, index: true
    add_column :careers, :association_id, :integer, index: true
    add_column :careers, :function, :string
  end
end
