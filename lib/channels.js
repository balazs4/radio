var _ = require('lodash');

module.exports = function(id) {
    var channels = [{
        "url": "http://205.164.62.20:8035",
        "cover" : "http://static.radio.de/images/broadcasts/70/fe/1375/c175.png"
    }, {
        "url": "http://87.230.53.43:7000",
        "cover" : "http://static.radio.de/images/broadcasts/c6/10/6615/c175.png"
    }, {
        "url": "http://87.230.53.43:8004",
        "cover" : "http://i.img.co/radio/45/19/1945_145.png"
    }, {
        "url": "http://pub10am.rockradio.com:80/rr_metalcore",
        "cover" : "http://static.radio.de/images/broadcasts/59/89/15093/c175.png"
    }, {
        "url": "http://91.121.138.222:8000",
        "cover" : "http://static.radio.net/images/broadcasts/40/42/14809/c175.png"
    }].map(function(channel, index) {
        if (!channel._id) {
            channel["_id"] = index;
        }
        return channel;
    });


    if (id) {
        var ch = _.find(channels, function(ch) {
            return ch._id == id;
        });

        return ch;
    }

    return channels;
}
