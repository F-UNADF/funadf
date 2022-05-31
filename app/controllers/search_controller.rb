class SearchController < ApplicationController

  def index
    structure_id = params[:search][:structure_id]
    @structure = Structure.find structure_id
    @query = params[:search][:request]
    q = @query.split(' ')
    r = []

    classes = ['User', 'Structure'].collect{|c| Object.const_get c}
    classes.each do|c|
      q.each do |query|
        c.global_search(query).each do |e|
          # EXCLUDE OF RESULT IF ALREADY MEMBER OR ITESELF
          unless @structure.members.map{|m| [m.class.to_s, m.id]}.include?([e.class.to_s, e.id]) || [e.class.to_s, e.id] == [@structure.class.to_s, @structure.id]
            r.push(e)
          end
        end
      end
    end

    @results = r.uniq.sort_by { |r| r[:id] }

    respond_to do |format|
      format.js
    end
  end

end