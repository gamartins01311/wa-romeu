FROM node:20-alpine

WORKDIR /app

# Copiar o package.json e package-lock.json (que já foram copiados manualmente para este diretório)
COPY ws_server/package*.json ./

RUN npm install

# Copiar o restante do código
COPY ws_server/ .

CMD ["node", "src/waServerConnection.js"]
