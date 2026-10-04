#!/bin/bash
set -e

if [ "$RAILS_ENV" = "production" ]; then
  echo "===> Starting Unicorn in production"
  rm -f shared/pids/unicorn.pid
  bundle exec unicorn -c /app/config/unicorn.rb -E production
else
  echo "===> Starting Vite dev server"
  bin/vite dev &

  echo "===> Starting Rails server"
  rm -f tmp/pids/server.pid
  exec bin/rails server -b 0.0.0.0 -p 3000
fi
