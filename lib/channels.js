var _ = require('lodash');

module.exports = function(id) {
    var channels = [{
        "url": "http://205.164.62.20:8035",
    }, {
        "url": "http://87.230.53.43:7000"
    }, {
        "url": "http://87.230.53.43:8004"
    }, {
        "url": "http://pub10am.rockradio.com:80/rr_metalcore"
    }, {
        "url": "http://91.121.138.222:8000"
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
