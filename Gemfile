source 'https://rubygems.org'

ruby '2.7.8'
gem 'rails', '6.1.7'

# AUTH
gem 'devise'
gem 'devise_invitable'
gem 'simple_token_authentication'
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem "omniauth-rails_csrf_protection"

# BACKGROUND JOBS
gem 'sidekiq'
gem 'sidekiq-scheduler'

# PDF
gem 'wicked_pdf'
gem 'wkhtmltopdf-binary'

# Fichiers
gem 'carrierwave'
gem 'aws-sdk-s3', require: false

# Front
gem 'vite_rails'

# ORM
gem 'mysql2'
gem 'geocoder', '~> 1.8', '>= 1.8.2'
gem 'public_activity'
gem 'state_machines-activerecord'

# Monitoring
gem 'exception_notification'
gem 'slack-notifier'
gem 'logtail-rails'

# Api / HTTP
gem 'faraday'
gem 'googleauth'
gem 'rack-cors', '~> 1.1'

gem 'haml-rails'

group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'faker'
  gem 'guard-test'
  gem 'spring'
  gem 'foreman'
end

group :production do
  gem 'unicorn'
end

group :test do
  gem 'cucumber-rails', require: false
  gem 'database_cleaner'
  gem 'test-unit'
end

