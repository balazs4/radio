const radio = require('express').Router();
module.exports = radio

const player = require('../lib/player');

const channels = [
    "http://87.230.53.43:7000",
    "http://87.230.53.43:8004",
    "http://91.121.138.222:8000"
]


radio.use('/:id', (req, res, next) => {
    req['channel'] = channels[req.params['id']]
    next();
})
radio.get('/:id', (req, res) => {
    const channel = req['channel'];
    res.json(channel)
});
radio.mkactivity('/:id', (req, res) => {
    const channel = req['channel'];

});

radio.mkactivity('/', (req, res) => {

})

radio.get('/', (req, res) => {
    res.json(channels)
});
