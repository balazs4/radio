var icy = require('icy');
var lame = require('lame');
var Speaker = require('speaker');
var events = require('events');


var Radio = (function() {
    function Radio(url) {
        this.url = url;
    }
    Radio.prototype = new events.EventEmitter;

    Radio.prototype.play = function() {
        var self = this;

        icy.get(this.url, function(res) {
            self.emit('connected', res.headers['icy-name']);

            res.on('metadata', function(metadata) {
                self.emit('songchanged', icy.parse(metadata));
            });
            var stream = res
                .pipe(new lame.Decoder())
                .pipe(new Speaker());

            self.stream = stream;
        });
    };

    Radio.prototype.stop = function() {
        if (this.stream) {
            this.stream.end();
        }
    };

    return Radio;
})();

module.exports = Radio;
