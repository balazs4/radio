var path = require('path');
var _ = require('lodash');

var Radio = require('../lib/radio');
var channels = require('../lib/channels');
var songparser = require('../lib/songparser');

var radio = null;

var router = function(app) {

    app.get('/channel', function(req, res) {
        res.json(channels);
    });

    app.get('/channel/:id', function(req, res) {
        var id = req.params.id;


        var channel = _.find(channels, function(ch) {
            return ch._id == id;
        });

        if (radio != null) {
            radio.stop();
            radio = null;
        }

        radio = new Radio(channel.url);
        radio.on('playing', function(info) {
            res.end();
        });
        radio.on('songchanged', function(info) {
            console.log(JSON.stringify(songparser(info)));
        });

        radio.play();
    });

    app.get('/', function(req, res) {
        var index = path.join(__dirname, "view", "index.html");
        res.sendFile(index);
    });
};

module.exports = router;
