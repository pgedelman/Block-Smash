const express = require('express');
const path = require('path');
const { startFlaskServer, stopFlaskServer } = require('./flaskManager');

const app = express();
const port = 3000;

// Serve the static files from the site and game-scripts directories
app.use(express.static(path.join(__dirname, '../site')));
app.use('/game-scripts', express.static(path.join(__dirname, '../game-scripts')));
app.use(express.json());

app.post('/start-flask', (req, res) => {
    startFlaskServer();
    res.send('Flask server started');
});

app.post('/stop-flask', (req, res) => {
    stopFlaskServer();
    res.send('Flask server stopped');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
