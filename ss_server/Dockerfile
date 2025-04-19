FROM node:20-alpine

# Instalar o Git no contêiner
RUN apk add --no-cache git

WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do conteúdo
COPY . .

CMD ["node", "src/socketServer.js"]
