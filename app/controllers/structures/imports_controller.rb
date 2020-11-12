class Structures::ImportsController < ApplicationController
  include Wicked::Wizard
  require 'array'

  steps :get_file, :params_import, :final

  def show
    case step
    when :get_file
      @upload = Upload.new
    when :params_import
      @upload = Upload.find params[:upload_id]
      @keys = User.prepare_import(@upload)
      @samples = []
      i = 0
      CSV.foreach(File.open(@upload.file.current_path), headers: false) do |row|
        i = i + 1
        next if @upload.has_heading && i == 1
        @samples << row
        break row if i == 6
      end
    end
    render_wizard
  end

  def update
    case step
      when :get_file
        @upload = Upload.new(upload_params)
        if @upload.save
          redirect_to wizard_path(next_step, :upload_id => @upload.id)
        else
          render_wizard @upload
        end
      when :params_import
        @upload = Upload.find params[:upload][:upload_id]

        old_keys = [:type, :name, :address_1, :town, :zipcode, :president]

        i = 0
        new_structures = []
        problem_structures = []
        CSV.foreach(File.open(@upload.file.current_path), headers: false) do |row|
          i = i+1
          next if i==1 && @upload.has_heading

          datas = row.to_h(old_keys)
          president = nil

          query = datas.delete(:president)
          unless query.blank?
            columns = %w{firstname lastname}
            query = query.split(' ')
            firstname = "%#{query.first}%"
            lastname = "%#{query.last}%"
            results = []
            query.each do |q|
              User.where("lastname LIKE :lastname AND firstname LIKE :firstname", {lastname: lastname, firstname: firstname}).each do |u|
                results.push(u)
              end
            end

            president = results.uniq.sort_by { |r| r[:id] }.first
          end

          if structure = Structure.create(datas)
            president.add_role :president, structure unless president.blank?
            new_structures << structure
          else
            problem_structures << structure
          end
        end
        redirect_to wizard_path(next_step, new_structures: new_structures.count, problem_structures: problem_structures.count, line: i )
    end
  end

  private
    def upload_params
      params[:upload].permit(:file, :has_heading)
    end


end