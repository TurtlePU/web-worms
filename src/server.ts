import path from 'path';

import express from 'express';
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (_, response) => {
    response.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use(express.static('client'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
