var config = {
    http: {
        url: "http://localhost",
        port: 4747,
        toString: function() {
            return this.url + ":" + this.port;
        }
    }
};

module.exports = config;
