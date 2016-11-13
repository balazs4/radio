const icy = require('icy');
const lame = require('lame');
const speaker = require('speaker');


module.exports = (url, onPlaying, onMetadata) => {
    icy.get(url, stream => {
        stream.on('metadata', raw => {
            onMetadata(icy.parse(raw))
        })
        stream.pipe(new lame.Decoder()).pipe(new speaker());
        onPlaying(stream)
    });
}
/*
try {
    player.end();
    res.sendStatus(202);
}
catch (error) {
    res.sendStatus(200);
}*/