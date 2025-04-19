FROM node:20-alpine

WORKDIR /app

# Copiar o package.json e package-lock.json para o diretório /app no contêiner
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do conteúdo do diretório ss_server
COPY . .

CMD ["node", "src/socketServer.js"]
