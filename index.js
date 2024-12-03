const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let narudzbe = [];

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

const pizze = [
    { id: 1, naziv: 'Margerita', cijena: 7.00 },
    { id: 2, naziv: 'Capriciosa', cijena: 9.00 },
    { id: 3, naziv: 'Slavonska', cijena: 6.00 },
    { id: 4, naziv: 'Fungi', cijena: 10.00 },
];

app.get("/pizze", (req, res) => {
    res.json(pizze);
});

app.get('/pizze/:id', (req, res) => {
    const id_pizza = req.params.id;
    if (isNaN(id_pizza)) {
        res.json({ message: 'Proslijedili ste parametar id koji nije broj!' });
        return;
    }
    const pizza = pizze.find(pizza => pizza.id == id_pizza);
    if (pizza) {
        res.json(pizza);
    } else {
        res.json({ message: 'Pizza s traženim ID-em ne postoji.' });
    }
});

app.post('/naruci', (req, res) => {
    const { narudzba, prezime, adresa, broj_telefona } = req.body;

    if (!narudzba || !prezime || !adresa || !broj_telefona) {
        return res.status(400).json({
            message: 'Nedostaju obavezni podaci (narudzba, prezime, adresa, broj_telefona)!'
        });
    }

    if (!Array.isArray(narudzba)) {
        return res.status(400).json({
            message: 'Polje narudzba mora biti array!'
        });
    }

    for (const stavka of narudzba) {
        if (!stavka.pizza || !stavka.velicina || !stavka.kolicina) {
            return res.status(400).json({
                message: 'Svaka narudžba mora sadržavati pizza, velicina i kolicina!'
            });
        }
    }

    const nepostojecePizze = narudzba
        .map(n => n.pizza)
        .filter(pizzaNaziv => !pizze.some(p => p.naziv.toLowerCase() === pizzaNaziv.toLowerCase()));

    if (nepostojecePizze.length > 0) {
        return res.status(400).json({
            message: `Sljedeće pizze ne postoje u jelovniku: ${nepostojecePizze.join(', ')}`
        });
    }

    let ukupnaCijena = 0;
    narudzba.forEach(stavka => {
        const pizza = pizze.find(p => p.naziv.toLowerCase() === stavka.pizza.toLowerCase());
        if (pizza) {
            let faktorCijene = 1;
            switch (stavka.velicina.toLowerCase()) {
                case 'mala': faktorCijene = 0.8; break;
                case 'srednja': faktorCijene = 1; break;
                case 'velika': faktorCijene = 1.3; break;
                case 'jumbo': faktorCijene = 1.5; break;
                default: faktorCijene = 1;
            }
            ukupnaCijena += pizza.cijena * faktorCijene * stavka.kolicina;
        }
    });

    narudzbe.push({
        id: narudzbe.length + 1,
        vrijeme: new Date(),
        stavke: narudzba,
        prezime,
        adresa,
        broj_telefona,
        ukupnaCijena
    });

    const pizzeOpis = narudzba.map(n => `${n.pizza} (${n.velicina})`).join(' i ');

    res.status(201).json({
        message: `Vaša narudžba za ${pizzeOpis} je uspješno zaprimljena!`,
        prezime,
        adresa,
        ukupnaCijena: ukupnaCijena.toFixed(2)
    });
});

app.get('/narudzbe', (req, res) => {
    res.json(narudzbe);
});

app.put('/pizze/:id', (req, res) => {
    let id_pizza_req = req.params.id;
    let tijelo_zahtjeva = req.body;

    if (isNaN(id_pizza_req)) {
        return req.json({ message: "Proslijedili ste parametar id koji nije broj" })
    }

    let index = pizze.findIndex(pizza => pizza.id = id_pizza_req)

    pizze[index] = tijelo_zahtjeva;

    console.log('pizze array', pizze)
    return req.json({ message: "Ažurirano" })
});

app.patch('/pizze/:id', (req, res) => {
    let id_pizza_req = req.params.id;
    let tijelo_zahtjeva = req.body;

    if (isNaN(id_pizza_req)) {
        return req.json({ message: "Proslijedili ste parametar id koji nije broj" })
    }

    let index = pizze.findIndex(pizza => pizza.id = id_pizza_req)

    pizze[index] = tijelo_zahtjeva;

    console.log(kljucevi_objekta);

    for (let kljuc of kljucevi_objekta) {
        if (pizze[index][kljuc] = tijelo_zahtjeva[kljuc]) {

        }
    }

    pizze[index] = tijelo_zahtjeva

    console.log(pizze);

    return req.json({ message: "Ažurirano" })
});

app.listen(PORT, (error) => {
    if (error) {
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});