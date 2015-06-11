var Radio = require('./lib/radio');
var channels = require('./lib/channels');
var songparser = require('./lib/songparser');

var channel = channels[0];
var radio = new Radio(channel.url);


radio.on('playing', function(info) {
    console.log("[ON AIR] " + info.name);
    channel["name"] = info.name;
});

radio.on('songchanged', function(info) {
	var song = songparser(info);
    console.log(JSON.stringify(song));
});

radio.play();
