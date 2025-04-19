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

# Verificar se o arquivo socketServer.js foi copiado corretamente
RUN ls -l 
RUN ls -l /app
RUN ls -l /app/src

EXPOSE 4521

# Comando para rodar o servidor
CMD ["node", "src/socketServer.js"]
