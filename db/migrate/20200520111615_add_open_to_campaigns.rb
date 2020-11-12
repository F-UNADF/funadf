class AddOpenToCampaigns < ActiveRecord::Migration
  def change
    remove_column :campaigns, :state, :string
    add_column :campaigns, :state, :string, default: :coming
  end
end
