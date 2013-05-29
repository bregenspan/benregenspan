module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: 'debug/source-map.js'
      },
      my_target: {
          files: {
              'build/main.js': [
                  'src/js/lib/event_target.js',
      
                  'src/js/connector/point.js',
                  'src/js/connector/polyline.js',
                  'src/js/connector/connector.js',
                  'src/js/lib/polyfill/RaF.js',
                  'src/js/lib/polyfill/addEventListener.js',
                  'src/js/lib/skrollr.min.js',
                  
                  'src/js/scroll-nav.js',

                  'src/js/index.js'
              ],
              'build/mobile-only.js': [
                  'src/js/lib/skrollr.mobile.min.js'
              ]
          }
      }
    },
    copy: {
      main: {
        files: [
            { expand: true, cwd: 'src/', src: ['**.html', '**.ico', 'fonts', 'fonts/**', 'img', 'img/**'], dest: 'build/'}
        ]
      }
    },
    watch: {
        js: {
            files: ['src/**.js', 'src/*/*.js'],
            tasks: ['uglify']
        },
        other: {
            files: 'src/**',
            tasks: ['copy']
        }
     },
     sass: {
        dist: {
            files: {
                'build/main.css': 'src/main.scss'
            }
        }
     },
     cssmin: {
        add_banner: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
        files: {
            'build/main.css': ['build/main.css']
        }
    }
}
     
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['uglify', 'copy', 'sass', 'cssmin']);
};
