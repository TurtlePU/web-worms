import express from 'express';
import path from 'path';

import { RoomHandler } from '../rooms';

/**
 * Wrapper on Express server for interaction needs.
 * 
 * @returns Express server with binded out-of-the-game requests
 */
export default function App() {
    const app = express();

    app.get('/', (_, res) => {
        res.sendFile(path.join(__dirname, '../../../client/index.html'));
    });

    app.get('/method=getRoom', (_, res) => {
        res.send({ id: RoomHandler.getRoom() });
    });

    app.get('/method=checkRoom/:id', (req, res) => {
        res.send({ exists: RoomHandler.checkRoom(req.params.id) });
    });

    app.use(express.static('client'));

    return app;
}
