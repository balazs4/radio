var url = require('url');

var parse = function(info) {
    try {
        var uri = url.parse("http://radio.localhost/parser?info=1" + info.metadata.StreamUrl, true);

        return {
            "artist": uri.query["artist"].replace(/( - )$/g, ""),
            "title": uri.query["title"].replace(/( - )$/g, ""),
            "album": uri.query["album"].replace(/( - )$/g, ""),
            "source" : info.radio
        };
    } catch (e) {
    	return {
    		"info" : info.metadata.StreamTitle,
    		"source" : info.radio
    	};
    }
}

module.exports = parse;
