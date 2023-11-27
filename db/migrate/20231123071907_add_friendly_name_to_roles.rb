class AddFriendlyNameToRoles < ActiveRecord::Migration[6.1]
  def change
    add_column :roles, :friendly_name, :string, after: 'name'
    add_column :roles, :short_descriptions, :string, after: 'friendly_name'

    remove_column :roles, :resource_id, :integer
    remove_column :roles, :resource_type, :string

    Role.all.each do |role|
      role.friendly_name = role.name.titleize
      role.short_descriptions = "Role : " + role.name.titleize
      role.save
    end
  end
end
