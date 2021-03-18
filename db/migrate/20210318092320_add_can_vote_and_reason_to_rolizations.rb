class AddCanVoteAndReasonToRolizations < ActiveRecord::Migration
  def change
    add_column :rolizations, :can_vote, :boolean, default: true
    add_column :rolizations, :reason, :string
  end
end
