FROM node:20-alpine

WORKDIR /app

# Copiar o package.json e package-lock.json do diretório correto
COPY ss_server/package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do ss_server
COPY ss_server/ .

CMD ["node", "src/socketServer.js"]
