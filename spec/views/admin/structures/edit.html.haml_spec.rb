require 'rails_helper'

RSpec.describe "admin/structures/edit", type: :view do
  before(:each) do
    @admin_structure = assign(:admin_structure, Admin::Structure.create!())
  end

  it "renders the edit admin_structure form" do
    render

    assert_select "form[action=?][method=?]", admin_structure_path(@admin_structure), "post" do
    end
  end
end
