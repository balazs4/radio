var request = require('request');

var notify = function(song) {
    request.post('http://ultrabook:4444/radio', {
        "form": song
    }, function(err, res, body) {
        if (err)
            console.log(err);
    });
};

module.exports = notify;
