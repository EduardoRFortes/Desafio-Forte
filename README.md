# Desafio Forte Security

Este projeto é um sistema de gerenciamento de biblioteca desenvolvido como parte do desafio técnico. Ele contempla o fluxo completo de empréstimos, devoluções, cálculo de multas e regras de disponibilidade, utilizando React, Node.js/Express e PostgreSQL.

## Tecnologias

* **Frontend:** React, React Bootstrap
* **Backend:** Node.js, Express, TypeScript
* **Banco de Dados:** PostgreSQL (via Docker)
* **Regras de Negócio:** Transações SQL, Date-fns (cálculo de datas e multas)

## Como Rodar o Projeto Localmente

### Pré-requisitos
* Docker e Docker Compose
* Node.js (v18+) e Yarn/NPM

### 1. Configuração do Banco de Dados
O projeto utiliza Docker para subir o banco PostgreSQL.

Na raiz do projeto, suba o container:

docker-compose up -d

> Aguarde alguns segundos para o banco iniciar.

### 2. Configuração do Backend (API)
Acesse a pasta \`api\`:

cd api

Crie um arquivo \`.env\` na raiz da pasta \`api\` com as seguintes configurações:

DB_USER=admin
DB_HOST=localhost
DB_NAME=postgres
DB_PASSWORD=admin
DB_PORT=5432

Instale as dependências e popule o banco de dados (Seed):

yarn install

# Este comando cria as tabelas e insere dados iniciais (Clientes/Livros)
yarn ts-node -r dotenv/config src/database/seed.ts

Inicie o servidor:

yarn dev

*A API rodará em \`http://localhost:8080\`*

### 3. Configuração do Frontend (Web)
Em um novo terminal, acesse a pasta \`web\`:

cd web

Instale as dependências:

yarn install

Inicie a aplicação:

yarn start

*O frontend rodará em \`http://localhost:3000\`*

## Rodando no GitHub CodeSpaces

Se você estiver testando este projeto via CodeSpaces, atente-se a dois detalhes:

1.  **Variáveis de Ambiente:** É necessário criar o arquivo \`.api/.env\` manualmente dentro do ambiente (conforme passo 2 acima), pois ele não é versionado.
2.  **URL da API:** O Frontend está configurado para apontar para \`localhost:8080\`. No CodeSpaces, o backend é exposto em uma URL pública (Port Forwarding).

> **Nota:** Para testar no CodeSpaces, pode ser necessário ajustar a \`API_BASE_URL\` nos arquivos \`src/components/NewLoanForm.tsx\` e \`book-loan-list/index.tsx\` para a URL pública gerada pelo GitHub na porta 8080.
