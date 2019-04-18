import express from 'express';
import http    from 'http';
import os      from 'os';
import path    from 'path';
import socket  from 'socket.io';

import listen  from './lib/listener';

import { initIdGenerator } from './lib/id-generator';
import digits from './data/id-digits.json';

initIdGenerator(digits, 3);

const app = express();
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.use(express.static('client'));

const httpServer = new http.Server(app);
const PORT = parseInt(process.env.PORT) || 3000;
const interfaces = os.networkInterfaces();

httpServer.listen(PORT, () => {
    Object.values(interfaces).forEach(ifaceInfo => {
        ifaceInfo.forEach(iface => {
            console.log(`Listening on ${iface.address}:${PORT}`);
        });
    });
});

const io = socket(httpServer);
io.on('connection', listen);
