class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.references :structure
      t.string :name
      t.text :description
      t.string :code
      t.datetime :start_at
      t.datetime :end_at
      t.boolean :opened
      t.string :state
      t.boolean :public

      t.timestamps
    end
  end
end
