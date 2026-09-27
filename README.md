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

Com `YOUTUBE_API_KEY`, a busca usa o YouTube Data API v3 somente no backend e acrescenta `karaokê` à pesquisa para priorizar vídeos com playback/letra e thumbnails reais. Sem a chave, a tela informa que a busca precisa ser configurada em vez de exibir músicas falsas.

## Observações do MVP

- As salas, participantes e filas são persistidas na tabela `karaokeRooms`, evitando que o QR Code perca a sala quando o servidor reinicia ou troca de instância.
- TV e celulares sincronizam o estado via consultas curtas, sem download ou armazenamento de vídeos.
- A TV incorpora vídeos reais e embeddable usando o player oficial do YouTube. O vídeo selecionado fica no palco da TV depois de adicionado à fila; a letra depende do próprio vídeo de karaokê escolhido.
- O próximo passo de produção é mover a sincronização curta para WebSocket autenticado.
