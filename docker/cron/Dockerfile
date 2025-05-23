FROM ruby:2.7.8-bullseye

ENV BUNDLER_VERSION=2.3.13

RUN apt-get update -qq && apt-get install -y cron git build-essential libpq-dev libmariadb-dev-compat nodejs

WORKDIR /app

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN gem install bundler -v "$BUNDLER_VERSION" && bundle install -j4

COPY . .

COPY docker/cron/cronjob /etc/cron.d/mycron
RUN chmod 0644 /etc/cron.d/mycron && crontab /etc/cron.d/mycron

COPY docker-cron.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]
