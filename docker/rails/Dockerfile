FROM ruby:3.2.4-bullseye

ENV BUNDLER_VERSION=2.3.13
ENV PYTHONPATH=/usr/bin/python3

RUN apt-get update -qq && \
    apt-get install -y apt-utils \
                       build-essential \
                       libpq-dev \
                       default-mysql-client \
                       libxrender1 \
                       libxext6 \
                       libfontconfig1 \
                       xfonts-base \
                       xfonts-75dpi \
                       wkhtmltopdf

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs build-essential

RUN mkdir /app
WORKDIR /app

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN gem install bundler -v "$BUNDLER_VERSION" && bundle install -j4

ADD package.json /app/package.json
RUN npm install

ADD . /app
# Assure-toi que wkhtmltopdf est accessible à l'utilisateur funadf
RUN chmod +x /usr/bin/wkhtmltopdf


EXPOSE 3000
