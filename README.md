# Worms II

Worms второго поколения в браузере.

## TODO: Основное

1. LobbyView
2. RoomView
3. ...

## События socket.io

### Запросы

Синтаксис:

```<канал>:<запрос>:(req | res)```

* ```req``` &mdash; запрос клиента к серверу
* ```res``` &mdash; ответ сервера клиенту

Например, на клиенте:

```typescript
socket.once('channel:query:res', (answer: string) => {
    console.log(answer);
});
socket.emit('channel:query:req');
```

Каналы:

1. ```join```
    * ```getLobby()``` &mdash; возвращает ID лобби, к которому можно подключиться.
    * ```checkLobby(ID: string)``` &mdash; можно ли подключиться к лобби с идентификатором ID?
    * ```checkRoom(roomID: string, socketID: string)``` &mdash; можно ли подключиться к комнате ```roomID```, если старый сокет был ```socketID```?

### Broadcast-события

Синтаксис:

```<канал>:<событие>:(send | receive)```

Например, на клиенте:

```typescript
socket.on('channel:event:receive', (senderID: string, message: string) => {
    console.log(`${senderID} said: ${message}`);
});
...
socket.to('first-room').emit('channel:event:send', 'Hello world');
```

Каналы:

1. ```lobby```
    * ```joined()``` &mdash; сокет подключился к лобби.
    * ```switched()``` &mdash; игрок готов/не готов (состояние меняется на противоположное) к игре.
    * ```left()``` &mdash; сокет отключился от лобби.
