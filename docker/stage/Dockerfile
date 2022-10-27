FROM node:12.14 AS build

USER node
RUN curl -k https://install.meteor.com/ | sh

USER root
RUN ln -s /home/node/.meteor/meteor /usr/local/bin/meteor
RUN mkdir -m 777 -p /app

USER node
WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn install

COPY --chown=node . .

RUN ls -lha

RUN cp ./client/.env.example ./client/.env

RUN yarn client-bundle-prod
RUN yarn build-backend
RUN yarn build-client

FROM phusion/passenger-nodejs:1.0.19

RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo 'deb https://deb.nodesource.com/node_12.x bionic main' > /etc/apt/sources.list.d/nodesource.list
RUN echo 'deb-src https://deb.nodesource.com/node_12.x bionic main' >> /etc/apt/sources.list.d/nodesource.list

RUN apt \
    -o Acquire::https::Verify-Peer=false \
    -o Acquire::AllowInsecureRepositories=true \
    -o Acquire::AllowDowngradeToInsecureRepositories=true \
    update

RUN apt \
    -o Acquire::https::Verify-Peer=false \
    -o Acquire::AllowInsecureRepositories=true \
    -o Acquire::AllowDowngradeToInsecureRepositories=true \
    upgrade nodejs -y

ENV HOME /root

CMD ["/sbin/my_init"]
RUN rm -f /etc/service/nginx/down; \
    rm /etc/nginx/sites-enabled/default

WORKDIR /home/app/webapp

COPY --from=build /app/build/server/app.tar.gz .
RUN tar -xzf app.tar.gz \
    && rm app.tar.gz \
    && cd ./bundle/programs/server \
    && npm i

COPY --from=build /app/build/client ./public

ADD nginx.config /etc/nginx/sites-enabled/webapp.conf
