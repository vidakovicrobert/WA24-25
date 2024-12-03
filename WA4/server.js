const express = require('express');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(express.json());

let zaposlenici = [];

const ucitajZaposlenike = async () => {
    try {
        const data = await fs.readFile('zaposlenici.json', 'utf8');
        zaposlenici = JSON.parse(data);
        console.log('Učitani zaposlenici:', zaposlenici);
    } catch (err) {
        console.error('Greška prilikom učitavanja datoteke:', err);
    }
};

ucitajZaposlenike();

const generateId = () => {
    return zaposlenici.length > 0 ? Math.max(...zaposlenici.map(z => z.id)) + 1 : 1;
};

app.get('/zaposlenici', (req, res) => {
    res.json(zaposlenici);
});

app.post('/zaposlenici', (req, res) => {
    const { ime, prezime, godine_staža, pozicija } = req.body;

    if (!ime || !prezime || godine_staža == null || !pozicija) {
        return res.status(400).json({ poruka: 'Svi podaci (ime, prezime, godine_staža, pozicija) su obavezni.' });
    }

    const noviZaposlenik = {
        id: generateId(),
        ime,
        prezime,
        godine_staža,
        pozicija,
    };

    zaposlenici.push(noviZaposlenik);
    res.status(201).json(noviZaposlenik);
});

app.get('/zaposlenici/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const zaposlenik = zaposlenici.find(z => z.id === id);

    if (!zaposlenik) {
        return res.status(404).json({ poruka: `Zaposlenik s ID-om ${id} nije pronađen.` });
    }

    res.json(zaposlenik);
});

app.listen(port, (error) => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${port}`);
    }
});
