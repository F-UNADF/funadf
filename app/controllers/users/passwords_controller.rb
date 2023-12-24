# frozen_string_literal: true

class Users::PasswordsController < Devise::PasswordsController

  skip_before_action :verify_authenticity_token

  # GET /resource/password/new
  def edit
    render layout: 'layouts/vuejs'
  end

  # POST /resource/password
  def create
      user = User.find_by_email(params[:email])
      if user
        user.send_reset_password_instructions
        render json: { message: 'Email sent' }, status: :ok
      else
        render json: { error: 'Email not found' }, status: :not_found
      end
  end

  # PUT /resource/password
  def update
    user = User.reset_password_by_token(params)
    if user.errors.empty?
      render json: { message: 'Password updated' }, status: :ok
    else
      render json: { error: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
