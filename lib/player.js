const icy = require('icy');
const lame = require('lame');
const speaker = require('speaker');

const rx = require('rxjs');
const stream2rx = require('stream-to-observable');

module.exports = url =>
    rx.Observable
        .bindCallback(icy.get)(url)
        .switchMap(stream => rx.Observable.create(obs => {
            const sound = stream.pipe(new lame.Decoder()).pipe(new speaker());
            obs.next(stream);
            return () => {
                sound.end();
            }
        }))
        .mergeMap(stream => stream2rx(stream, { dataEvent: 'metadata' })
            .map(raw => icy.parse(raw))
            .map(metadata => Object.assign({}, metadata, { radio: stream.headers['icy-name'], when: new Date() }))
        )