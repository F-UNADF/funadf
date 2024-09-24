class AddMemberToFees < ActiveRecord::Migration[6.1]
  def up
    add_column :fees, :member_id, :integer
    add_column :fees, :member_type, :string

    add_index :fees, [:member_type, :member_id]

    Fee.all.each do |fee|
      fee.update(member_id: fee.user_id, member_type: 'User')
    end

    remove_column :fees, :user_id
  end

  def down
    add_column :fees, :user_id, :integer

    Fee.all.each do |fee|
      fee.update(user_id: fee.member_id)
    end

    remove_column :fees, :member_id
    remove_column :fees, :member_type
  end
end
