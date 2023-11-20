#lib\active_storage\service\no_protocol_disk_service.rb
require "active_storage/service/disk_service"
module ActiveStorage
  class Service::NoProtocolDiskService < Service::DiskService
    def url(key, *options)
      super(key, *options).gsub /http(s)?:/, ''
    end
  end
end