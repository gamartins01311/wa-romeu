# Definir a imagem base
FROM node:20-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código-fonte
COPY src/ ./src/

# Expor a porta do aplicativo
EXPOSE 4521

# Definir o comando para iniciar a aplicação
CMD ["node", "src/socketServer.js"]
