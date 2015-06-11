var app = require('express')();
var config = require('./config');

require('./router')(app);
require('./start')(app, config.http, console.log);

