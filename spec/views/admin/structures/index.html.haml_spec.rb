require 'rails_helper'

RSpec.describe "admin/structures/index", type: :view do
  before(:each) do
    assign(:admin_structures, [
      Admin::Structure.create!(),
      Admin::Structure.create!()
    ])
  end

  it "renders a list of admin/structures" do
    render
  end
end
