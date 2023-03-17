FROM ruby:2.7.1
RUN apt-get update -qq && \
    apt-get install -y apt-utils \
                       build-essential \
                       libpq-dev \
                       default-mysql-client

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
      apt-get install -y nodejs build-essential

RUN mkdir /app
WORKDIR /app
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN bundle install -j4
RUN npm install
ADD . /app

EXPOSE 3000
