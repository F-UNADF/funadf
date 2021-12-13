Rake::Task["yarn:install"].clear

namespace :yarn do
  task :install do
    # Do nothing, since there's no yarn
  end
end