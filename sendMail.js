const nodemailer = require('nodemailer');

// Definisci il trasportatore SMTP
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tuoindirizzoemail',
        pass: 'tua-password'
    }
});

// Definisci le informazioni dell'email
let mailOptions = {
    from: 'tuoindirizzo@gmail.com',
    to: 'destinatario@example.com',
    subject: 'Oggetto dell\'email',
    text: 'Contenuto del messaggio'
};

// Invia l'email
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email inviata: ' + info.response);
    }
});
