FROM node:12
WORKDIR /usr/src/clean-node-api
RUN npm install --only=prod
