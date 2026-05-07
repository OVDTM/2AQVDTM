FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./server/
RUN npm install --prefix server

COPY server/ ./server/

EXPOSE 5010

CMD ["node", "server/server.js"]
