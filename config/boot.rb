# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exist?(ENV['BUNDLE_GEMFILE'])

# Rails 6.1 ne charge pas Logger lui-même ; concurrent-ruby >= 1.3.5 ne le fait plus non plus.
require 'logger'
