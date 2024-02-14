const nodemailer = require('nodemailer');

// Definisci il trasportatore SMTP
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

// Definisci le informazioni dell'email
let mailOptions = {
    from: '',
    to: '',
    subject: '',
    text: ''
};

// Invia l'email
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email inviata: ' + info.response);
    }
});
