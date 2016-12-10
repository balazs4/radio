const radio = require('express').Router();
const player$ = require('../lib/player');
const rx = require('rxjs');

const channels = [
    "http://87.230.53.43:7000",
    "http://87.230.53.43:8004",
    "http://91.121.138.222:8000"
]

let stream = rx.Observable.empty().subscribe(_ => { });

radio.use('/:id', (req, res, next) => {
    req['channel'] = channels[req.params['id']]
    next();
})
radio.get('/:id', (req, res) => res.json(req['channel']));

radio.mkactivity('/:id', (req, res) => {
    stream.unsubscribe();
    stream = player$(req['channel'])
        .retry(3)
        .subscribe(song => console.log(new Date().toString(), song));
    res.sendStatus(204);
});

radio.mkactivity('/', (req, res) => {
    stream.unsubscribe();
    res.sendStatus(204)
})

radio.get('/', (req, res) => res.json(channels));

module.exports = radio