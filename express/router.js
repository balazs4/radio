var path = require('path');
var base64 = require('base64-img');

var Radio = require('../lib/radio');
var channels = require('../lib/channels');
var songparser = require('../lib/songparser');
var notifier = require('../lib/notifier')


var radio = null;

var stop = function(rdio) {
    if (rdio != null) {
        rdio.stop();
        rdio = null;
    }
};

var router = function(app) {

    app.get('/stop', function(req, res) {
        stop(radio);
        console.log("Stop");
        res.end();
    });

    app.get('/channel', function(req, res) {
        res.json(channels());
    });

    app.get('/channel/:id', function(req, res) {
        var id = req.params.id;

        var channel = channels(id);

        stop(radio);

        radio = new Radio(channel.url);
        radio.on('playing', function(info) {
            res.end();
        });
        radio.on('songchanged', function(info) {
            var song = songparser(info);

            console.log(JSON.stringify(song));

            base64.requestBase64(channel.cover, function(err, r, data) {
                song["cover"] = data;
                notifier(song);
            });
            
        });

        radio.play();
    });

    app.get('/', function(req, res) {
        var index = path.join(__dirname, "view", "index.html");
        res.sendFile(index);
    });
};

module.exports = router;
