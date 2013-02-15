var fs = require('fs')
  , childProcess = require('child_process');

module.exports = function (grunt) {

  grunt.initConfig({
    lint: {
      all: [
        'grunt.js'
      , 'lib/**/*.js'
      , 'test/**/*.js'
      ]
    }
  , jshint: {
      options: JSON.parse(fs.readFileSync('./.jshintrc'))
    }
  , watch: {
      lint: {
        files: [ '<config:lint.all>' ]
      , tasks: 'lint'
      }
    }
  });

};
