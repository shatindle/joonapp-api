FROM node:23-alpine

LABEL org.opencontainers.image.title="Joon API" \
      org.opencontainers.image.description="Unofficial API for interacting with Joon" \
      org.opencontainers.image.authors="sha.tindle@gmail.com"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY . .

USER node

COPY --chown=node:node . .

RUN npm install

ENTRYPOINT ["node", "syncRewards.js"]