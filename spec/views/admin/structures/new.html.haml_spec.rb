require 'rails_helper'

RSpec.describe "admin/structures/new", type: :view do
  before(:each) do
    assign(:admin_structure, Admin::Structure.new())
  end

  it "renders new admin_structure form" do
    render

    assert_select "form[action=?][method=?]", admin_structures_path, "post" do
    end
  end
end
