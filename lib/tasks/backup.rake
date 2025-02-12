namespace :db do  desc "Backup project database. Options: DIR=backups RAILS_ENV=production MAX=7" 

  task :backup => [:environment] do

    desc "Script qui permet de backup la base de données."
    desc "Options: DIR=backups RAILS_ENV=production MAX=7"
    desc "Elle garde une copie local pendant 7 jours."
    desc "Elle stock chaque backup dans le cloud via S3."
    desc "La tache est lancée via la commande: rake db:backup"
    desc "Une tache cron se chargera de lancer la tache de facon periodique."

    desc "### TACHE CRON ###"
    desc "MAILTO='p.gruson@gmail.com'"
    desc "0 4 6 * * docker exec -it funadf_app bash -c 'RAILS_ENV=production bundle exec rake db:backup'"

    datestamp = Time.now.strftime("%Y-%m-%d_%H-%M-%S")    
    base_path = Rails.root
    base_path = File.join(base_path, ENV["DIR"] || "backups")
    backup_base = File.join(base_path, 'db_backups')
    backup_folder = File.join(backup_base, datestamp)
    backup_file = File.join(backup_folder, "#{Rails.env}_dump.sql")   

    FileUtils.mkdir_p(backup_folder)    
    db_config = ActiveRecord::Base.configurations[Rails.env] 

    passwords = YAML.load_file(File.join(Rails.root, 'docker', 'mysql', 'password.yml'))

    rootpswd = passwords["services"]['password']['environment']['MYSQL_ROOT_PASSWORD']

    `mysqldump -h #{db_config[:host]} -u root -p#{rootpswd} #{db_config[:database]} > #{backup_file}`

    raise "Unable to make DB backup!" if ( $?.to_i > 0 )

    # Upload to S3
    backup = Backup.new
    backup.name = Time.now.strftime("%Y-%m-%d_%H-%M-%S")
    backup.file.attach(io: File.open(backup_file), filename: backup_file)
    backup.save


    # Remove local backup file older than 7 days
    dir = Dir.new(backup_base)
    all_backups = dir.entries.sort[2..-1].reverse
    puts "Created backup: #{backup_file}"     
    max_backups = (ENV["MAX"].to_i if ENV["MAX"].to_i > 0) || 7
    unwanted_backups = all_backups[max_backups..-1] || []
    for unwanted_backup in unwanted_backups
      FileUtils.rm_rf(File.join(backup_base, unwanted_backup))
    end
    puts "Deleted #{unwanted_backups.length} backups, #{all_backups.length - unwanted_backups.length} backups available" 
  end
end