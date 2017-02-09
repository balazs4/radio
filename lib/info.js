const rx = require('rxjs');
const {get} = require('axios');
const {encode} = require('node-base64-image');

module.exports = song => rx.Observable
    .of(song)
    .map(({ artist, title }) => `${artist}+${title}`.replace(' ', '+'))
    .switchMap(term => rx.Observable
        .fromPromise(get(`https://api.spotify.com/v1/search?type=track&market=DE&limit=1&q=${term}`))
        .catch(err => rx.Observable.of({data: { tracks: { items: [] } }}))
        .map(response => response.data['tracks']['items'])
        .map(items => items.length == 0
            ? { name: '' }
            : items[0]['album']
        )
        .map(({name, images}) => ({
            name,
            url: images && images.length > 0
                ? images[0]['url']
                : 'http://icons.iconarchive.com/icons/elegantthemes/beautiful-flat/128/radio-icon.png'
        })
        )
    )
    .switchMap(({name, url}) => rx.Observable
        .bindNodeCallback(encode)(url, { string: true })
        .map(x => Object.assign({}, song, { album: name, cover: x }))
    )
