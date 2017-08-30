/* global module */

/**
 * Grunt is only used to script deployment of the project.
 *
 * TODO: drop Grunt and use a simpler shell script/Grunt-free Git management
 */
module.exports = function (grunt) {
  'use strict';

  const releaseTag = new Date().toISOString().replace(/\..+/, '').replace(/-/g, '.').replace(/:/g, '.').replace(/T/, '-'); // YYYY.MM.DD-HH.MM.SS

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    gitRemoteTag: {
      release: {
        options: {
          tag: releaseTag
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'master',
        message: 'Auto-generated commit',
        repo: 'git@github.com:bregenspan/bregenspan.github.io.git',
        tag: releaseTag
      },
      src: '**'
    }
  });

  grunt.loadNpmTasks('grunt-git-remote-tag');
  grunt.loadNpmTasks('grunt-gh-pages');

  // tag a release and deploy current "dist" folder
  grunt.registerTask('deploy', ['gitRemoteTag', 'gh-pages']);
};
