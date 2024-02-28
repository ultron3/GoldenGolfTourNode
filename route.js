const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');
const fs = require('fs');
const logFilePath = path.join(__dirname, 'server.log');
const puppeteer = require('puppeteer');


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

//Route per eseguire lo scraping del sito GesGolf e creare una nuova tabella nel database
app.get('/scrape', async (req, res) => {
    try {
        // Inizializza il browser Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // URL del sito da cui eseguire lo scraping
        const url = 'https://www.gesgolf.it/GolfOnline/Clubs/classifiche.aspx?GaraId=592479&Anno=2024&Mese=2&circolo_id=638';
        await page.goto(url);

        // Esegui lo scraping dei dati desiderati
        const data = await page.evaluate(() => {
            const playerRows = Array.from(document.querySelectorAll('.tbody tr'));
            return playerRows.map(row => {
                const name = row.querySelector('.player-name').textContent.trim();
                const score = row.querySelector('.player-score').textContent.trim();
                return { name, score };
            });
        });

        // Chiudi il browser Puppeteer
        await browser.close();

        // Crea una nuova tabella nel database per memorizzare i dati estratti
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS gesgolf.golfclub (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                punteggio VARCHAR(50) NOT NULL
            )
        `;
        db.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Errore nella creazione della tabella nel database:', err);
                res.status(500).json({ error: 'Errore nella creazione della tabella nel database' });
                return;
            }
            console.log('Tabella creata nel database:', result);
        });

        // Inserisci i dati estratti nella nuova tabella
        data.forEach(player => {
            const { name, score } = player;
            const insertQuery = 'INSERT INTO giocatori (nome, punteggio) VALUES (?, ?)';
            db.query(insertQuery, [name, score], (err, result) => {
                if (err) {
                    console.error('Errore nell\'inserimento dei dati nel database:', err);
                    return;
                }
                console.log('Dati inseriti nel database:', result);
            });
        });

        res.status(200).json({ message: 'Scraping completato e tabella creata nel database' });
    } catch (error) {
        console.error('Errore durante lo scraping:', error);
        res.status(500).json({ error: 'Errore durante lo scraping' });
    }
});
// porta del server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in ascolto sulla porta ${PORT}`);
});
   