var express = require('express'),
    app = express();
    server = require('http').createServer(app),
    socketio = require('socket.io').listen(server),
    config = require('./config/config');

require('./config/express')(app, config);
require('./config/routes')(app);

server.listen(config.port);

require('./app/controllers/socket')(socketio);
