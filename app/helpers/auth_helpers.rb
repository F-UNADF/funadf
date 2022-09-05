module AuthHelpers
  def auth_token_to_headers(user)
    request.headers['X-User-Email'] = "#{user.email}"
    request.headers['X-User-Token'] = "#{user.authentication_token}"
  end

  def clear_auth_token
    request.headers['X-User-Email'] = nil
    request.headers['X-User-Token'] = nil
  end
end