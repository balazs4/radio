const radio = require('express').Router();
const rx = require('rxjs');
const {get, post} = require('axios');
const {encode} = require('node-base64-image');

const player$ = require('../lib/player');

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
        .do(meta => console.log(meta))
        .map(meta => {
            const [artist, title] = meta.StreamTitle.split(' - ');
            return { artist, title, source: meta.radio };
        })
        .concatMap(song => rx.Observable
            .of(song)
            .map(({ artist, title }) => `${artist}+${title}`.replace(' ', '+'))
            .switchMap(term => rx.Observable.fromPromise(get(`https://api.spotify.com/v1/search?type=track&market=DE&limit=1&q=${term}`)).map(response => response.data['tracks']['items'][0]['album']))
            .switchMap(album => rx.Observable.bindNodeCallback(encode)(album.images[0].url, { string: true }).map(x => Object.assign({}, song, { album: album['name'], cover: x }))
            )
        )
        .do(({artist, title, album}) => console.log(artist, title, album))
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