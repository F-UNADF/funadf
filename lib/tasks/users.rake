require 'csv'

namespace :users do

  task :update_or_create_from_file => :environment do |t, args|
    file = './db/seeds/pasteurs-2020.csv'


    csv_text = File.read(file)

    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    existing_users = User.all.to_a
    new_user = 0
    updated_user = 0

    csv.each do |row|
      # Moulding.create!(row.to_hash)

      # puts row['ID']

      # user = User.find_or_create_by(email: row['email'], lastname: row['lastname'])

      user = User.find_by(id: 1000+row['ID'].to_i)



      if user.blank?
        puts "**** NOUVEAU PASTEUR *****"
        user = User.new
        new_user = new_user + 1
      else
        puts "**** MISE A JOURS PASTEUR *****"
        updated_user = updated_user + 1
      end

      user.lastname = row['lastname']
      user.firstname = row['firstname']
      user.email = row['email']
      user.phone_1 = row['phone_1']
      user.phone_2 = row['phone_2']
      user.town = row['town']
      user.zipcode = row['zipcode']
      user.level = row['level']

      user.save

      existing_users = existing_users - [user]

      puts user.inspect
    end

    puts "**** PASTEURS RESTANTS *****"
    disabled_user = 0
    existing_users.each do |user|
      puts "#{user.lastname} #{user.firstname} - #{user.email} : #{user.level}"
      user.disabled = true
      user.save
      disabled_user = disabled_user + 1
    end

    puts "**** NOMBRE DE PASTEURS MIS A JOURS *****"
    puts updated_user

    puts "**** NOMBRE DE PASTEURS AJOUTES *****"
    puts new_user

    puts "**** NOMBRE DE PASTEURS DESACTIVES *****"
    puts disabled_user
  end

  task :add_itb_users => :environment do |t, args|
    file = './db/seeds/membres-itb.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    itb = Structure.find(6)
    puts "AJOUT DES MEMBRES A L'ITB"

    csv.each do |row|
      town = row['town']
      puts town

      structure = Structure.where(town: town).first
      if structure
        puts "Ajouté l'eglise : #{structure.name} comme membre de l'ITB"

        structure.add_role :member, itb

        Elector.find_or_create_by(resource_id: structure.id, resource_type: "structure", structure_id: itb.id, can_vote: true)
      else
        puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{town}"
      end

    end
  end

  task :add_min_users => :environment do |t, args|
    file = './db/seeds/membres-min.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    itb = Structure.find(8)
    puts "AJOUT DES MEMBRES A MA MI NORD"

    csv.each do |row|
      town = row['town']
      puts town

      structure = Church.where(town: town).first
      if structure
        puts "Ajouté l'eglise : #{structure.name} comme membre de la MI NORD"

        structure.add_role :member, itb

        Elector.find_or_create_by(resource_id: structure.id, resource_type: "structure", structure_id: itb.id, can_vote: true)
      else
        puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{town}"
      end

    end
  end

  task :add_epse_users => :environment do |t, args|


    itb = Structure.find(8)
    puts "AJOUT DES MEMBRES A SOLIDARITE EVANGELIQUE ET ENTRAIDE PASTO"

    users = User.where(level: ['Pasteur stagiaire', 'Pasteur AEM', 'Pasteur APE', 'Pasteur Agréé', 'Pasteur Partenaire'])

    ep = Structure.find 12
    se = Structure.find 7

    users.each do |user|

      user.add_role :member, ep
      user.add_role :member, se

      puts "Ajouté l'eglise : #{user.name} comme membre de la SOLIDARITE EVANGELIQUE ET ENTRAINE PASTO"
    end
  end

  task :add_se_users => :environment do |t, args|
    file = './db/seeds/membres-se.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    se = Structure.find(7)
    puts "AJOUT DES MEMBRES A LA SOLIDARITE EVANG"

    csv.each do |row|
      zipcode = row['zipcode']
      puts zipcode

      structure = Church.where(zipcode: zipcode).first
      if structure
        puts "Ajouté l'eglise : #{structure.name} comme membre de la MI NORD"

        structure.add_role :member, se

        Elector.find_or_create_by(resource_id: structure.id, resource_type: "structure", structure_id: se.id, can_vote: true)
      else
        puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{zipcode}"
      end

    end
  end

  task :check_users_level => :environment do |t, args|

    valid_levels = User.get_levels

    all_users = User.all

    all_users.each do |user|
      user_level = user.level

      unless valid_levels.include?(user_level)
        puts "L'utilisateur #{user.id} #{user.lastname} #{user.firstname} n'est pas valide (Champs : Niveau de reconnaissance)"
      end
    end
  end

  task :update_users_gratitudes => :environment do |t,args|
    users = User.all

    users.each do |user|
      g = user.gratitudes.build(start_at: Date.today)
      g.level = user.level
      g.save
    end
  end

  task :generate_token => :environment do |t, args|

    puts "Generate Roken for each User"

    User.all.each do |u|
      if u.access_token.blank?
        puts "U : #{u.id} - Set Token"
        u.set_access_token
        u.save
      end
    end
  end

  task :send_direct_access_link_to_all => :environment do |t, args|

    users = User.all

    users.each do |user|
      puts "Envoie du lien d'accès direct à #{user.firstname} #{user.lastname} (#{user.email})"
      user.send_invitation_email
    end
  end

  task :send_direct_access_link_to_fcem => :environment do |t, args|

    fcem = Structure.find 13

    users = fcem.users

    users.each do |user|
      puts "Envoie du lien d'accès direct à #{user.firstname} #{user.lastname} (#{user.email})"
      user.send_direct_access_link
    end
  end

  task :add_france_nord_users => :environment do |t, args|
    file = './db/seeds/convention-nord.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    se = Structure.find_by(name: 'FRANCE NORD')
    puts "AJOUT DES MEMBRES A LA FRANCE NORD"

    csv.each do |row|

      user = User.find_by(email: row['Email'])

      # puts user.inspect

      if user
        puts "AJOUTER L'UTILISATEUR : #{user.name} COMME MEMBRE DE FRANCE NORD"
        user.add_role :member, se

      else
        puts "IMPOSSIBLE D'AJOUTER L'UTILISATEUR : #{row['Noms']} #{row['Prénom']}"
      end
      # structure = Church.where(zipcode: zipcode).first
      # if structure
      #   puts "Ajouté l'eglise : #{structure.name} comme membre de la MI NORD"

      #   structure.add_role :member, se


      # else
      #   puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{zipcode}"
      # end

    end

  end

  task :add_france_sud_users => :environment do |t, args|
    file = './db/seeds/convention-sud.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    se = Structure.find_by(name: 'FRANCE SUD')
    puts "AJOUT DES MEMBRES A LA FRANCE SUD"

    csv.each do |row|

      user = User.find_by(email: row['Email'])

      # puts user.inspect

      if user
        puts "AJOUTER L'UTILISATEUR : #{user.name} COMME MEMBRE DE FRANCE SUD"
        user.add_role :member, se

      else
        puts "IMPOSSIBLE D'AJOUTER L'UTILISATEUR : #{row['Noms']} #{row['Prénoms']}"
      end
      # structure = Church.where(zipcode: zipcode).first
      # if structure
      #   puts "Ajouté l'eglise : #{structure.name} comme membre de la MI NORD"

      #   structure.add_role :member, se


      # else
      #   puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{zipcode}"
      # end

    end

  end

  task :add_convention_nationale_users => :environment do |t, args|
    file = './db/seeds/convention-nord.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    se = Structure.find_by(name: 'CONVENTION NATIONALE')
    puts "AJOUT DES MEMBRES A LA CONVENTION NATIONALE"

    csv.each do |row|

      user = User.find_by(email: row['Email'])

      # puts user.inspect

      if user
        puts "AJOUTER L'UTILISATEUR : #{user.name} COMME MEMBRE DE CONVENTION NATIONALE"
        user.add_role :member, se

      else
        puts "IMPOSSIBLE D'AJOUTER L'UTILISATEUR : #{row['Noms']} #{row['Prénom']}"
      end
      # structure = Church.where(zipcode: zipcode).first
      # if structure
      #   puts "Ajouté l'eglise : #{structure.name} comme membre de la MI NORD"

      #   structure.add_role :member, se


      # else
      #   puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{zipcode}"
      # end

    end

    file = './db/seeds/convention-sud.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    csv.each do |row|

      user = User.find_by(email: row['Email'])

      # puts user.inspect

      if user
        puts "AJOUTER L'UTILISATEUR : #{user.name} COMME MEMBRE DE CONVENTION NATIONALE"
        user.add_role :member, se

      else
        puts "IMPOSSIBLE D'AJOUTER L'UTILISATEUR : #{row['Noms']} #{row['Prénoms']}"
      end
      # structure = Church.where(zipcode: zipcode).first
      # if structure
      #   puts "Ajouté l'eglise : #{structure.name} comme membre de la MI NORD"

      #   structure.add_role :member, se


      # else
      #   puts "IMPOSSIBLE D'AJOUTER L'EGLISE DE #{zipcode}"
      # end

    end

  end

  task :add_fc_users => :environment do |t, args|
    file = './db/seeds/membres-fc.csv'


    csv_text = File.read(file)
    csv = CSV.parse(csv_text, headers: true, :col_sep => ",", :row_sep => :auto)

    fc = Structure.find(13)
    puts "AJOUT DES MEMBRES A l'assoc FEMME CHRETIENNE"

    csv.each do |row|
      email = row['EMAIL']
      puts email

      user = User.find_or_create_by(email: row['EMAIL'])
      user.lastname = row['LASTNAME']
      user.firstname = row['FIRSTNAME']

      if user.new_record?
        user.invite!
      end

      if user
        puts "AJOUTER L'UTILISATEUR : #{user.name} COMME MEMBRE DE FEMME CHRETIENNE"
        user.add_role :member, fc unless user.has_role? :member, fc

      else
        puts "IMPOSSIBLE D'AJOUTER L'UTILISATEUR : #{row['FIRSTNAME']} #{row['LASTNAME']}"
        puts "ERROS : #{user.errors.inspect}"
      end

    end
  end

  task :add_fees_from_csv => :environment do |t, args|

  end

end