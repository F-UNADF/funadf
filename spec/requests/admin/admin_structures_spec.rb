require 'rails_helper'

RSpec.describe "Admin::Structures", type: :request do
  describe "GET /admin_structures" do
    it "works! (now write some real specs)" do
      get admin_structures_path
      expect(response).to have_http_status(200)
    end
  end
end
