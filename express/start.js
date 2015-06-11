var start = function(app, config, log) {
    app.listen(config.port, function() {
        log("Server listening on " + config.toString());
    });
};

module.exports = start;
