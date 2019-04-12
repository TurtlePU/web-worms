import express from 'express';
import http    from 'http';
import path    from 'path';
import socket  from 'socket.io';

import listen  from './lib/socket/main';

const app = express();
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.use(express.static('client'));

const httpServer = new http.Server(app);
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Listening on *:${PORT}`);
});

const io = socket(httpServer);
io.on('connection', listen);
