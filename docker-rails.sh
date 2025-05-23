#!/bin/bash
set -e

if [ "$RAILS_ENV" = "production" ]; then
  echo "===> Starting Unicorn in production"
  bundle exec unicorn -c /app/config/unicorn.rb -E production
else
  echo "===> Starting Rails server in $RAILS_ENV"
  rm -f tmp/pids/server.pid
  bin/rails server -b 0.0.0.0 -p 3000
fi
