import express from 'express';

import { connectToDatabase } from './db.js';

const app = express();

let db = await connectToDatabase();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Pizza app');
});

const PORT = 3000;

app.get('/pizze', (req, res) => {
    res.status(200).json(pizze);
});
app.get('/pizze/:id', (req, res) => {
    const id = req.params.id;
    const pizza = pizze.find(pizza => pizza.id === id); // Oprez, ovo je metoda Array.find() koja dohvaća prvi element koji zadovoljava callback predikat
    res.status(200).json(pizza);
});

app.get('/users', async (req, res) => {
    let users_collection = db.collection('users'); // pohranjujemo referencu na kolekciju
    let allUsers = await users_collection.find().toArray(); // dohvaćamo sve korisnike iz kolekcije i pretvaramo Cursor objekt u Array
    res.status(200).json(allUsers);
});

app.listen(PORT, error => {
    if (error) {
        console.log('Greška prilikom pokretanja servera', error);
    }
    console.log(`Pizza poslužitelj dela na http://localhost:${PORT}`);
});