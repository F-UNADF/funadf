class Admin::ImportsController < ApplicationController
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

        old_keys = User.prepare_import(@upload)
        keys = {}
        old_keys.each do |k|
          keys[k.to_sym] = params["col-name-#{k}"]
        end

        i = 0
        new_users = []
        problem_users = []
        CSV.foreach(File.open(@upload.file.current_path), headers: false) do |row|
          i = i+1
          next if i==1 && @upload.has_heading

          datas = row.to_h(old_keys)

          old_keys.each do |k|
            datas[k.to_sym] = datas.delete(keys[k.to_sym])
          end
          datas.delete(:id)
          if user = User.invite!(datas)
            new_users << user
          else
            problem_users << user
          end
        end
        redirect_to wizard_path(next_step, new_users: new_users.count, problem_users: problem_users.count, line: i )
    end
  end

  private
    def upload_params
      params[:upload].permit(:file, :has_heading)
    end


end