#!/bin/sh
# https://stackoverflow.com/a/38732187/1935918
set -e

if [ -f /app/shared/pids/unicorn.pid ]; then
  rm /app/shared/pids/unicorn.pid
fi

RAILS_ENV=${ENVIRONMENT} bundle exec rake db:migrate 2>/dev/null || RAILS_ENV=${ENVIRONMENT} bundle exec rake db:schema:load

exec bundle exec "$@"