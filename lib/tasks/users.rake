require 'csv'

namespace :users do

  desc "Add Meeting to Campaign"

  task :update_or_create_from_file => :environment do |t, args|


    file = './db/seeds/pasteurs-2020.csv'


    csv_text = File.read(file)

    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    existing_users = User.all.to_a

    csv.each do |row|
      # Moulding.create!(row.to_hash)

      # puts row['ID']

      # user = User.find_or_create_by(email: row['email'], lastname: row['lastname'])

      user = User.find_by(id: 1000+row['ID'].to_i)


      if user.blank?
        puts "**** NOUVEAU PASTEUR *****"
        user = User.new
      else
        puts "**** MISE A JOURS PASTEUR *****"
      end

      user.lastname = row['lastname']
      user.firstname = row['firstname']
      user.email = row['email']
      user.phone_1 = row['phone']
      user.zipcode = row['zipcode']
      user.level = row['level']

      existing_users = existing_users - [user]

      puts user.inspect
    end

    puts "**** PASTEURS RESTANTS *****"
    existing_users.each do |user|
      puts "#{user.lastname} #{user.firstname} - #{user.email} : #{user.level}"
    end




  end
end