module UiConfig
  class ConfigFactory
    MAP = {
      "regions"      => -> { StructuresConfig.new("regions") },
      "posts"        => -> { PostsConfig.new },
      "associations" => -> { StructuresConfig.new("associations") },
      "churches"     => -> { StructuresConfig.new("churches") },
      "fees"     => -> { FeesConfig.new },
    }

    def self.build(model)
      builder = MAP[model]
      raise "Unknown model '#{model}'" unless builder

      { config: builder.call.call }
    end
  end
end