module ApplicationHelper

  def ldate(dt, hash = {})
    dt ? l(dt, hash) : ""
  end

end
