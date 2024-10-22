const express = require('express');

let app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, function () {
    console.log('Slušam');
});

const port = 3000;
app.listen(port, (error) => {
    if (error) {
        console.error("Greška");
    } else {
        console.log("Slušam na portu");
    }
})

