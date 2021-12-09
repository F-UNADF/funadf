class CreateAttachments < ActiveRecord::Migration[4.2]
  def change
    create_table :attachments do |t|
      t.references :post, index: true, foreign_key: true

      t.timestamps null: false
    end


  end
end
