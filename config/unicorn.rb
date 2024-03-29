# set path to application
app_dir = File.expand_path("../..", __FILE__)
shared_dir = "#{app_dir}/shared"
working_directory app_dir


# Set unicorn options
worker_processes 4
preload_app true
timeout 30

# Set up socket location
listen "#{shared_dir}/sockets/unicorn_1.sock", :backlog => 128
listen "#{shared_dir}/sockets/unicorn_2.sock", :backlog => 128

# Logging
stderr_path "#{shared_dir}/log/unicorn.stderr.log"
stdout_path "#{shared_dir}/log/unicorn.stdout.log"

# Set master PID location
pid "#{shared_dir}/pids/unicorn.pid"