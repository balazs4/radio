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
            res.on('metadata', function(metadata) {
                var data = {
                    metadata :  icy.parse(metadata),
                    radio : res.headers['icy-name'],
                    url : this.url
                };
                self.emit('songchanged', data);
            });
            var stream = res
                .pipe(new lame.Decoder())
                .pipe(new Speaker());

            self.emit('playing', {
                name: res.headers['icy-name'],
                stream: stream
            });
        });
    };
    return Radio;
})();

module.exports = Radio;
