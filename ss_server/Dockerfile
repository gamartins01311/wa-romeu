FROM node:20-alpine

WORKDIR /app

# Copiar o package.json e package-lock.json
COPY ./ss_server/package*.json ./

RUN npm install

CMD ["node", "src/socketServer.js"]
