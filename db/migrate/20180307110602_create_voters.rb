class CreateVoters < ActiveRecord::Migration
  def change
    create_table :voters, id: false do |t|
      t.references :motion, index: true
      t.references :elector, index: true
      t.datetime :voted_at
      t.string :ip
    end
  end
end
