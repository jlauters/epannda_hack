
var express = require('express')
  , path = require('path')
  , config = require('./config/config');

var app = express();
app.set('vew engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

require('./config/routes')(app, config);

var server;
server = app.listen(config.port, function() {
    console.log("Express server listening on port " + server.address().port);
});

module.exports = {
    app: app,
    server: server,
    config: config
}

