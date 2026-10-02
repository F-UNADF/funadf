# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
# Correspondance partielle : :token masque aussi fcm_token, reset_password_token, invitation_token…
Rails.application.config.filter_parameters += [:password, :password_confirmation, :passw, :token, :secret, :_key, :crypt, :salt]
