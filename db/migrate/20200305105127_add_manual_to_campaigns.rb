class AddManualToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :manual, :boolean
  end
end
