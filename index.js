var Radio = require('./lib/radio');

var radio = new Radio("http://205.164.62.20:8035");


radio.on('connected', function(name) {
    console.log("[ON AIR] " + name);
});

radio.on('songchanged', function(metadata) {
    console.log("Now playing '" + metadata.StreamTitle + "'");
});

radio.play();

setTimeout(function() {
    radio.stop();
}, 3000);
