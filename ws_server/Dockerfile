# Definir a imagem base
FROM node:20-alpine

# Instalar git (necessário para dependências npm que usam repositórios git)
RUN apk add --no-cache git

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todo o código-fonte
COPY . .

# Expor a porta do aplicativo
EXPOSE 3000

# Definir o comando para iniciar a aplicação
CMD ["node", "src/waServerConnection.js"]
