# KARAOKÊ DO VALE

MVP web do Karaokê do Vale: a TV cria uma sala automaticamente em `/tv`, exibe um QR Code e os celulares entram em `/join/:roomCode` para pesquisar músicas, adicionar à fila e controlar a reprodução.

## Rotas

- `/` — apresentação do produto
- `/tv` — host da TV, criação automática de sala, QR Code e fila
- `/join/:roomCode` — entrada do celular sem instalação
- `/room/:roomCode` — controle remoto mobile-first

## Configuração

Crie um `.env` baseado no exemplo:

```env
YOUTUBE_API_KEY=
APP_URL=https://seu-dominio.com
```

Sem `YOUTUBE_API_KEY`, o MVP usa um catálogo demonstrativo para permitir validar o fluxo de sala e fila. Com a chave configurada, a busca usa o YouTube Data API v3 somente no backend.

## Observações do MVP

- As salas e filas são mantidas em memória no servidor para validação rápida do fluxo nesta primeira versão.
- TV e celulares sincronizam o estado via consultas curtas, sem download ou armazenamento de vídeos.
- A TV incorpora vídeos elegíveis usando o player oficial do YouTube; itens demonstrativos exibem uma tela de palco até uma chave real ser conectada.
- O próximo passo de produção é trocar o store em memória por PostgreSQL/MySQL e mover a sincronização para WebSocket autenticado.
