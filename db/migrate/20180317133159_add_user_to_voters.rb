class AddUserToVoters < ActiveRecord::Migration
  def change
    add_reference :voters, :user, index: true
  end
end
