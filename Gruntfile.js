'use strict';

var request = require('request');

module.exports = function (grunt) {
  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'app.js'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'app.js',
          'app/**/*.js',
          'config/*.js',
          'work/js/app/*.js',
          'work/sass/*.scss',
        ],
        tasks: ['jshint', 'uglify', 'concat', 'compass', 'delayed-livereload']
      },
      jade: {
        files: ['app/views/**/*.jade'],
        options: { livereload: reloadPort },
      }
    },
    uglify: {
      options: {
        toplevel: true,
        compress: true,
        beautify: {
          ascii_only: true,
        },
        mangle: true,
        preserveLicenseComments: true,
      },
      files: {
        'public/js/app/visualize.js': 'work/js/app/visualize.js',
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      lib: {
        src: [
          'work/js/lib/d3/d3.min.js',
          'work/js/lib/zepto/zepto.min.js',
        ],
        dest: 'public/js/lib/libraries.js',
      },
      app: {
        src: [
          'work/js/app/visualize.js',
        ],
        dest: 'public/js/app/visualize.js',
      },
    },
    compass: {
      dev: {
        options: {
          config: 'config.rb',
          environment: 'development'
        },
      },
    },
    jshint: {
      options: {
        eqeqeq: true,
        undef: true,
        //unused: true,
        latedef: true,
        quotmark: 'single',
        trailing: true,
        esnext: true,
        globals: {
          location: true,
          alert: true,
          history: true,
          define: true,
          require: true,
          setTimeout: true,
          cleatTimeout: true,
          setInterval: true,
          clearInterval: true,
          Math: true,
          window: true,
          document: true,
          console: true,
          arguments: true,
          Image: true,
          navigator: true,
          Array: true,
          Object: true,
          RegExp: true,
          localStorage: true,
          sessionStorage: true,
          getComputedStyle: true,
          Zepto: true,
          THREE: true,
          requestAnimationFrame: true,
          d3: true,
          google: true,
        },
      },
      defaults: ['work/js/app/*.js'],
    },
  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
        var reloaded = !err && res.statusCode === 200;
        if (reloaded)
          grunt.log.ok('Delayed live reload successful.');
        else
          grunt.log.error('Unable to make a delayed live reload.');
        done(reloaded);
      });
    }, 500);
  });

  grunt.loadNpmTasks('grunt-develop');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['uglify', 'concat', 'watch']);
};
