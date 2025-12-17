# rails task to initialize the database
# add an admin user by prompt
# add 5 Churches
# add 5 Associations
# add 5 users to each association
require 'faker'

namespace :app do

  task :init => :environment do |t, args|

    puts "Creating admin user"
    # create admin user with promp
    STDOUT.puts "Prenom de l'admin: "
      firstname = STDIN.gets.strip
    STDOUT.puts "Nom de l'admin: "
    lastname = STDIN.gets.strip
    STDOUT.puts "Email de l'admin: "
    email = STDIN.gets.strip

    password = ""
    password_confirmation = "!"

    while (password != password_confirmation) do
      STDOUT.puts "Mot de passe de l'admin: "
      password = STDIN.gets.strip
      STDOUT.puts "Confirmation du mot de passe de l'admin: "
      password_confirmation = STDIN.gets.strip
    end

    admin_user = User.create({
                               firstname: firstname,
                               lastname: lastname,
                               email: email,
                               password: password,
                               password_confirmation: password_confirmation
                             })

    admin_user.add_role :admin

    puts "Creating 5 Churches"
    # create 5 churches
    5.times do |i|
      Church.create({
                      name: Faker::Company.name,
                      address_1: Faker::Address.street_address,
                      zipcode: Faker::Address.zip_code,
                      town: Faker::Address.city,
                    })
    end

    puts "Creating 5 Associations"
    # create 5 associations
    5.times do |i|
      Association.create({
                           name: Faker::Company.name,
                           address_1: Faker::Address.street_address,
                           zipcode: Faker::Address.zip_code,
                           town: Faker::Address.city,
                         })
    end

    puts "Creating 5 users for each association"
    # create 5 users for each association
    associations = Association.all
    associations.each do |association|
      5.times do |i|
        u = User.create({
                      firstname: Faker::Name.first_name,
                      lastname: Faker::Name.last_name,
                      email: Faker::Internet.email,
                      password: "FakePassword#{i}",
                      password_confirmation: "FakePassword#{i}",
                    })

        u.add_role :member, association
      end
    end

    puts "Creating 5 users for each church"
    # create 5 users for each church
    churches = Church.all
    churches.each do |church|
      5.times do |i|
        u = User.create({
                      firstname: Faker::Name.first_name,
                      lastname: Faker::Name.last_name,
                      email: Faker::Internet.email,
                      password: "FakePassword#{i}",
                      password_confirmation: "FakePassword#{i}",
                    })

        u.add_role :member, church
      end
    end


  end

end