module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
          files: {
              'build/main.js': [
                  'src/js/connector/point.js',
                  'src/js/connector/polyline.js',
                  'src/js/connector/connector.js',
                  'src/js/lib/RaF_polyfill.js',
                  'src/js/lib/skrollr.min.js',
                  'src/js/lib/skrollr.mobile.min.js'
              ]
          }
      }
    },
    copy: {
      main: {
        files: [
            { expand: true, cwd: 'src/', src: ['**.html', 'fonts', 'fonts/**', 'img', 'img/**'], dest: 'build/'}
        ]
      }
    },
    watch: {
        scripts: {
            files: 'src/**.js',
            tasks: ['uglify']
        },
        other: {
            files: 'src/**',
            tasks: ['copy']
        }
     }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'copy']);
};
