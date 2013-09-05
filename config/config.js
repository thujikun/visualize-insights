var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'visualize-insights'
    },
    port: 3000,
    db: 'mongodb://localhost/visualize-insights-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'visualize-insights'
    },
    port: 3000,
    db: 'mongodb://localhost/visualize-insights-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'visualize-insights'
    },
    port: 3000,
    db: 'mongodb://localhost/visualize-insights-production'
  }
};

module.exports = config[env];
