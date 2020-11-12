require "rails_helper"

RSpec.describe Admin::StructuresController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/admin/structures").to route_to("admin/structures#index")
    end

    it "routes to #new" do
      expect(:get => "/admin/structures/new").to route_to("admin/structures#new")
    end

    it "routes to #show" do
      expect(:get => "/admin/structures/1").to route_to("admin/structures#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/admin/structures/1/edit").to route_to("admin/structures#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/admin/structures").to route_to("admin/structures#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/admin/structures/1").to route_to("admin/structures#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/admin/structures/1").to route_to("admin/structures#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/admin/structures/1").to route_to("admin/structures#destroy", :id => "1")
    end

  end
end
