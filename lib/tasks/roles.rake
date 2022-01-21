namespace :roles do

  desc "Add Meeting to Campaign"

  task :change_roles_sheme => :environment do |t, args|

    roles = Role.all

    uniq_role = []

    roles.each do |role|

      puts "Role n° #{role.id} as name : #{role.name}"
      unless role.name.in?(uniq_role)
        uniq_role << role.name
      end
    end

    puts uniq_role

  end
end