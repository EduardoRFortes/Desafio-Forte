FROM node:20.17.0

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

ENTRYPOINT ["yarn", "start:dev"]

# Copia o script para o contêiner
COPY docker-entrypoint.sh /usr/local/bin/

# Define o script como o Entrypoint. 
# Ele será o primeiro a rodar e executará o comando CMD.
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# Este é o comando que será passado para o script Entrypoint ($@)
CMD ["yarn", "run", "dev"]
