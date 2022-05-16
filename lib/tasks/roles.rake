namespace :roles do

  desc "Add Meeting to Campaign"

  task :change_roles_sheme => :environment do |t, args|

    roles = Role.all

    uniq_role = []
    new_index_role = 10001

    roles.each do |role|

      #role : Quel role (name) pour quel structure
      puts "OLD Role : #{role.inspect}"

      #Find Rolization
      rolization = Rolization.where(role_id: role.id).first #LE ROLE EST ATTRIBUER A (membre)

      unless rolization.blank?
        puts "Rolization : #{rolization.inspect}"

        #FIND OR CREATE A ROLE UNIQUE WITH 10K+ ID
        new_role = Role.where('id > 10000 AND name = ?', role.name).first
        if new_role.blank?
          new_role = Role.create(id: new_index_role, name: role.name)
          new_index_role = new_index_role+1
        end

        puts "NEW Role : #{new_role.inspect}"

        Membership.create(role_id: new_role, structure: role.resource, member: rolization.resource)
      end

    end

  end
end