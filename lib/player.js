const icy = require('icy');
const lame = require('lame');
const speaker = require('speaker');

const rx = require('rxjs');
const stream2rx = require('stream-to-observable');

module.exports = (url) =>
    rx.Observable
        .bindCallback(icy.get)(url)
        .do(stream => {
            stream.pipe(new lame.Decoder()).pipe(new speaker());
        })
        .mergeMap(stream => 
            stream2rx(stream, {dataEvent: 'metadata'})
            .map(raw => icy.parse(raw))
        )
        