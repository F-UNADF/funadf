require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Funadf
  class Application < Rails::Application

    config.time_zone = 'Paris'
    config.active_record.default_timezone = :local
    config.active_record.time_zone_aware_attributes = false
    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    # config.i18n.default_locale = :fr
    config.i18n.enforce_available_locales = true
    config.i18n.default_locale = :fr

    config.quiet_assets = true

    config.assets.enabled = false
  end
end
