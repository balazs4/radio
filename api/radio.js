const radio = require('express').Router();
module.exports = radio

const channels = [
    "http://87.230.53.43:7000",
    "http://87.230.53.43:8004",
    "http://91.121.138.222:8000"
]

radio.get('/channels/:id', (req, res) => {
    const index = req.params['id'];
    res.json(channels[index]);
});

radio.get('/channels/', (req, res) => {
    res.json(channels)
});

radio.get('/', (req, res) => {
    res.send('Now playing: NOTHING')
});