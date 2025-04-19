FROM node:20-alpine

WORKDIR /app

# Copiar o package.json da raiz
COPY ../package*.json ./

RUN npm install

# Copiar o restante do código
COPY . .

CMD ["node", "src/socketServer.js"]
