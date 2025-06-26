#!/bin/bash
set -e

# Démarre Sidekiq
exec bundle exec sidekiq -C config/sidekiq.yml
