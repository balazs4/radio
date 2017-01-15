const radio = require('express').Router();
const rx = require('rxjs');
const {post} = require('axios');

const player$ = require('../lib/player');
const info$ = require('../lib/info');

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
        .filter(meta => !meta.StreamTitle.startsWith('NEXT: '))
        .map(({StreamTitle, when, source}) => {
            const [artist, title] = StreamTitle.split(' - ');
            return { artist, title, source, when };
        })
        .concatMap(info$)
        .do(song => console.log(Object.assign({}, song, { cover: '...' })))
        .subscribe(song => {
            post('http://ultrabook:4444/radio', song).catch(_ => { })
        });
    res.sendStatus(204);
});

radio.mkactivity('/', (req, res) => {
    stream.unsubscribe();
    res.sendStatus(204)
})

radio.get('/', (req, res) => res.json(channels));

module.exports = radio