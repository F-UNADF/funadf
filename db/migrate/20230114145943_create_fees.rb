class CreateFees < ActiveRecord::Migration[6.1]
  def change
    create_table :fees do |t|
      t.references :user, foreign_key: true, type: :integer
      t.string :what
      t.date :paid_at

      t.timestamps
    end
  end
end
