const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server frontend in ascolto sulla porta ${PORT}`);
});
