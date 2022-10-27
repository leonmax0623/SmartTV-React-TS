FROM node:12.14

USER node
RUN curl -k https://install.meteor.com/ | sh

USER root
RUN ln -s /home/node/.meteor/meteor /usr/local/bin/meteor

USER node
WORKDIR /app

EXPOSE 3000
EXPOSE 3007
