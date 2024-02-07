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
// Middleware per scrivere su un file di log
app.use((req, res, next) => {
    const logMessage = `${new Date().toISOString()} - Nuova richiesta ricevuta: ${req.method} ${req.url}\n`;

    // Scrivi sul file di log
    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Errore nella scrittura del file di log:', err);
        }
    });

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
