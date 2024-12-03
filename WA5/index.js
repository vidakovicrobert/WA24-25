import express from 'express';

import { connectToDatabase } from './db.js';

const app = express();

let db = await connectToDatabase();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Pizza app');
});

const PORT = 3000;

app.listen(PORT, error => {
    if (error) {
        console.log('Greška prilikom pokretanja servera', error);
    }
    console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
});