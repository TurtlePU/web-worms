import http from 'http';

import express from './lib/express';
import socket from './lib/socket/main';

const app = express();
const httpServer = new http.Server(app);
const io = socket(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Listening on *:${PORT}`);
});
