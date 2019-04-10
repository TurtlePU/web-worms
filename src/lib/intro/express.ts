import express from 'express';
import path from 'path';

/**
 * Wrapper on Express server for interaction needs.
 * 
 * @returns Express server with basic requests
 */
export default function App() {
    const app = express();

    app.get('/', (_, res) => {
        res.sendFile(path.join(__dirname, '../../../client/index.html'));
    });

    app.use(express.static('client'));

    return app;
}
