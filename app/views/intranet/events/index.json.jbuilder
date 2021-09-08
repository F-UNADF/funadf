json.array! @events do |event|
  json.id event.id
  json.title event.title
  json.start event.start_at
  json.end event.end_at
  json.url edit_intranet_event_path(event)
end