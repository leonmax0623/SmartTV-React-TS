FROM node:12.14 AS build

USER node
RUN curl -k https://install.meteor.com/ | sh

USER root
RUN ln -s /home/node/.meteor/meteor /usr/local/bin/meteor
RUN mkdir -m 777 -p /app

USER node
WORKDIR /app
#error An unexpected error occurred: "EACCES: permission denied, open '/app/yarn.lock'"
#Хмм похоже такое случается есть зависимости отличаются от реальных
#то есть я забыл добавить их в yarn.lock
#При установке докер пытался его обновить и у него не получалось
#TODO наверное надо дать node права на запись
COPY package*.json yarn.lock ./
RUN yarn install

COPY --chown=node . .

RUN ls -lha

#RUN cp ./client/.env.example ./client/.env
# копируем реальные настройки - они должны быть на сервере на котором собирается докер
#RUN cp ./client/.env ./client/.env
RUN cp ./client/.env.prod ./client/.env

RUN yarn client-bundle-prod
# RUN yarn run csstypes
RUN yarn --maxWorkers=1 build-backend
RUN yarn --maxWorkers=1 build-client

FROM phusion/passenger-nodejs:1.0.11

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
