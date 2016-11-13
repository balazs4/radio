const app = require('express')();

app.use('/api/radio/', require('./api/radio'));
const player = require('./lib/player');
let active = undefined;
app.mkactivity('/play', (req, res) => {
    player('http://87.230.53.43:7000',
        stream => {
            res.json(stream.headers);
            active = stream;
        },
        metadata => {
            console.log(JSON.stringify(metadata));
        });
});

app.mkactivity('/stop', (req, res) => {
    if (active)
        active.end();
    res.sendStatus(202);
})

app.get('/', (req, res) => {
    res.send("Hello");
});

app.listen(4747);