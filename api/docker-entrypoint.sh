#!/bin/bash
# Força permissão de leitura/escrita para o usuário 'node'
# Se o 'node' não funcionar, usa o UID 1000 (um usuário padrão em muitos contêineres)

# Executa o comando principal definido no CMD (que será "yarn run dev")
exec "$@"
