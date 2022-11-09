Rails.application.config.middleware.use ExceptionNotification::Rack,
      slack: {
        webhook_url: Rails.application.secrets.slack_webhooks,
        username: 'Alfred',
        icon_emoji: ":fearful:"
      }