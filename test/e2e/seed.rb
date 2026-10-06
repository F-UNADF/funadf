# Données de départ des tests de bout en bout (base funadf_e2e, vidée à chaque lancement).
# Lancé par bin/e2e : RAILS_ENV=e2e bin/rails runner test/e2e/seed.rb
# Les identifiants sont repris dans test/e2e/support/data.js : garder les deux fichiers alignés.
abort 'Seed réservé à RAILS_ENV=e2e' unless Rails.env.e2e?

PASSWORD = 'MotDePasse-e2e-1'.freeze

ActiveRecord::Base.transaction do
  # Rôles applicatifs et rôles de structure
  {
    'admin' => 'Administrateur', 'moderator' => 'Modérateur', 'president' => 'Président',
    'secretary' => 'Secrétaire', 'treasurer' => 'Trésorier', 'director' => 'Directeur', 'member' => 'Membre'
  }.each { |name, friendly| Role.create!(name: name, friendly_name: friendly) }

  def user!(email, firstname, lastname, level: nil, town: nil, disabled: false)
    user = User.new(email: email, firstname: firstname, lastname: lastname, town: town,
                    password: PASSWORD, password_confirmation: PASSWORD, disabled: disabled)
    user.skip_invitation = true
    user.save!
    user.update_columns(invitation_accepted_at: Time.now)
    Career.create!(user: user, level: level, start_at: Date.new(2015, 1, 1)) if level
    user
  end

  admin = user!('admin@e2e.test', 'Alice', 'Admin', level: 'Pasteur AEM')
  admin.add_role :admin

  pasteur    = user!('pasteur@e2e.test', 'Pierre', 'Pasteur', level: 'Pasteur AEM', town: 'Lyon')
  president  = user!('president@e2e.test', 'Paul', 'President', level: 'Pasteur AEM', town: 'Marseille')
  stagiaire  = user!('stagiaire@e2e.test', 'Sophie', 'Stagiaire', level: 'Pasteur stagiaire', town: 'Lille')
  user!('desactive@e2e.test', 'Denis', 'Desactive', level: 'Pasteur AEM', disabled: true)
  user!('oubli@e2e.test', 'Olivier', 'Oubli', level: 'Pasteur AEM')
  user!('marc@e2e.test', 'Marc', 'Martin', level: 'Pasteur APE', town: 'Nantes')
  user!('jeanne@e2e.test', 'Jeanne', 'Durand', level: 'Pasteur APE', town: 'Rennes')
  user!('bruno@e2e.test', 'Bruno', 'Bloque', level: 'Pasteur APE', town: 'Dijon')

  # Église présidée par Paul PRESIDENT (il vote en son nom)
  eglise = Church.create!(name: 'Église E2E de Marseille', town: 'Marseille', zipcode: '13001')
  president.add_role :president, eglise
  Church.create!(name: 'Église E2E de Bordeaux', town: 'Bordeaux', zipcode: '33000')

  # Fédération organisatrice des votes et éditrice des actus
  federation = Association.create!(name: 'Fédération E2E', town: 'Paris', zipcode: '75001')
  [pasteur, president, stagiaire].each { |member| member.add_role :member, federation }
  eglise.add_role :member, federation

  # Documents : une catégorie existante pour les dépôts de l'admin
  Category.create!(name: 'Statuts et règlements', kind: 'document', color: '#251A7A', order: 1)
end

puts "Seed e2e : #{User.count} utilisateurs, #{Structure.count} structures"
