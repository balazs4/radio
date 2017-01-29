const radio = require('express').Router();
const rx = require('rxjs');
const {post} = require('axios');

const player$ = require('../lib/player');
const info$ = require('../lib/info');

const channels = [
    "http://85.25.43.55:80/hell.mp3",
    "http://85.25.43.55:80/nuernberg.mp3",
    "http://uk3.internet-radio.com:8108"
]

let stream = rx.Observable.empty().subscribe(_ => { });

radio.use('/:id', (req, res, next) => {
    req['channel'] = channels[req.params['id']]
    next();
})
radio.get('/:id', (req, res) => res.json(req['channel']));

radio.patch('/:id', (req, res) => {
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

radio.patch('/', (req, res) => {
    stream.unsubscribe();
    res.sendStatus(204)
})

radio.get('/', (req, res) => res.json(channels));

module.exports = radio
