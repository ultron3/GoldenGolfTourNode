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

// route principale
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
// route per vedere i referti
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
// route per vedere le coordinate bancarie
app.get('/banca',(req,res)=>{
    db.query('SELECT * FROM coordinate_bancarie',(err,result)=>{
        if (err) {
            console.error('Errore nella query:', err);
            res.status(500).send('Errore nel server');
            return;
        }
        res.json(result);
    });
});
// route per vedere le credenziali degli utenti
app.get('/credenziali',(req,res)=>{
    db.query('SELECT * FROM login',(err,result)=>{
        if (err) {
            console.error('Errore nella query:', err);
            res.status(500).send('Errore nel server');
            return;
        }
        res.json(result);
    });
});

// Definisci la route per il login
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Query per verificare le credenziali
    const query = `SELECT * FROM login WHERE email = ? AND password = ? `;
    db.query(query, [email,password], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Errore nel database' });
            return;
        }

        if (results.length > 0) {
            res.status(200).json({ message: 'Login riuscito' });
        } else {
            res.status(401).json({ error: 'Credenziali non valide' });
        }
    });
});


// porta del server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
   