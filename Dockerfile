FROM phusion/passenger-nodejs:1.0.11

RUN curl -s https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
RUN echo 'deb https://deb.nodesource.com/node_12.x bionic main' > /etc/apt/sources.list.d/nodesource.list
RUN echo 'deb-src https://deb.nodesource.com/node_12.x bionic main' >> /etc/apt/sources.list.d/nodesource.list && apt-get update

# максимальная поддерживаемая версия node js - 12!
RUN apt-get upgrade nodejs -y

ENV HOME /root

CMD ["/sbin/my_init"]
RUN rm -f /etc/service/nginx/down
RUN rm /etc/nginx/sites-enabled/default

WORKDIR /home/app/webapp

COPY ./build/server/prtv.tar.gz .
RUN tar -xvzf prtv.tar.gz
RUN cd ./bundle/programs/server && npm i

COPY ./build/client ./public

ADD nginx.config /etc/nginx/sites-enabled/webapp.conf
