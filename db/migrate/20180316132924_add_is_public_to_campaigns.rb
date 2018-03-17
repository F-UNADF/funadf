class AddIsPublicToCampaigns < ActiveRecord::Migration
  def change
    remove_column :campaigns, :public, :boolean
    add_column :campaigns, :is_public, :boolean
  end
end
