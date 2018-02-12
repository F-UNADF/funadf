require 'rails_helper'

RSpec.describe "admin/structures/show", type: :view do
  before(:each) do
    @admin_structure = assign(:admin_structure, Admin::Structure.create!())
  end

  it "renders attributes in <p>" do
    render
  end
end
