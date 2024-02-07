const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const fs = require('fs');
const logFilePath = path.join(__dirname, 'server.log');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'golfclub',
    database: 'golfclub'
});

// Middleware per abilitare le richieste CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Configura il dominio del client che desideri consentire
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.get('/', (req, res) => {
    db.query('SELECT * FROM partecipanti', (err, result) => {
        if (err) {
            console.error('Errore nella query:', err);
            res.status(500).send('Errore nel server');
            return;
        }
        res.json(result);
        
    });
});

app.get('/referti', (req, res) => {
    db.query('SELECT * FROM referti', (err, result) => {
        if (err) {
            console.error('Errore nella query:', err);
            res.status(500).send('Errore nel server');
            return;
        }
        res.json(result);
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
