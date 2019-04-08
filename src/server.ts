import express from 'express';
import path from 'path';

import { RoomHandler } from './lib/rooms';

const app = express();

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/method=getRoom', (_, res) => {
    res.send({ id: RoomHandler.getRoom() });
});

app.get('/method=checkRoom/:id', (req, res) => {
    res.send({ exists: RoomHandler.checkRoom(req.params.id) });
});

app.use(express.static('client'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
