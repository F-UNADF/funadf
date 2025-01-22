ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
 
class ActiveSupport::TestCase
  include Devise::Test::IntegrationHelpers
  fixtures :all
end