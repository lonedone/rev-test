FROM node:16-alpine

RUN mkdir -p /srv/app/node_modules && chown -R node:node /srv/app

WORKDIR /srv/app

USER node

COPY --chown=node:node package*.json .

RUN npm ci --omit=dev

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "/srv/app/app.js" ]
