class AddOrderToCategoriesAndDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :order, :integer
    add_column :documents, :order, :integer
  end
end
