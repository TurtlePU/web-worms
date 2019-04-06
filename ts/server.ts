import express from 'express';
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (_, response) => {
    response.sendFile('./client/page/index.html');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
