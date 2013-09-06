var express = require('express'),
    app = express();
    mongoose = require('mongoose'),
    server = require('http').createServer(app),
    socketio = require('socket.io').listen(server),
    fs = require('fs'),
    config = require('./config/config');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

require('./config/express')(app, config);
require('./config/routes')(app);

server.listen(config.port);

require('./config/socket')(socketio);
