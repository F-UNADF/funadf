class Admin::PagesController < AdminController

  def home
    render 'admin/pages/home', layout: 'admin/layouts/vuejs'
  end

end
