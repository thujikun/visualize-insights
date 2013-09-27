var mongoose = require('mongoose'),
    config = require('./config'),
    fs = require('fs'),
    db,

    modelsPath;

mongoose.connect(config.db);
db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

modelsPath = __dirname + '/../app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

module.exports = db;