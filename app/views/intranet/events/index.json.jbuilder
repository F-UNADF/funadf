json.array! @events do |event|
  json.id event.id
  json.title event.title
  json.start event.start_at
  json.end event.end_at
  if current_user.is_admin?
    json.url edit_intranet_event_path(event)
  else
    json.url intranet_event_path(event)
  end
end