namespace :roles do

  desc "Add Meeting to Campaign"

  task :change_roles_sheme => :environment do |t, args|

    roles = Role.all

    roles.each do |role|
      puts "*** NOUVEAU RÔLE ***"

      #role : Quel role (name) pour quel structure
      puts "J'ai récupéré le role : #{role.name} #{(!role.resource.blank?)? ('de la structure ' + role.resource.name) : 'de l\'application' }"

      #Find Rolization
      rolizations = Rolization.where(role_id: role.id) #LE ROLE EST ATTRIBUER A (membres)

      rolizations.each_with_index do |rolization, index|
        unless rolization.blank? || rolization.resource.blank?
          puts "Ce rôle concerne:  #{rolization.resource.name}"
          puts "Je créé ou récupère le role : #{role.name} pour #{rolization.resource.name} #{(!role.resource.blank?)? ('de la structure ' + role.resource.name) : 'de l\'application' } "
          rolization.resource.add_role role.name, role.resource, rolization.can_vote, rolization.reason
        end
      end
    end

    #DELETE ALL UNUSED ROLES
    Role.left_outer_joins(:memberships).where(memberships: {id: nil}).destroy_all
  end
end