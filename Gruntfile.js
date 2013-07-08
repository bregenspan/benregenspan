/* global module */

module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["build/*"],

        shell: {
            serve: {
                command: 'cd src; python -m SimpleHTTPServer 8080'
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "./src/js/",
                    mainConfigFile: "./src/js/main.js",
                    dir: "./build/js/",
                    modules: [{
                        name: 'main'
                    },
                    {
                        name: '404'
                    }]
                }
            }
        },

        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/', src: [
                        '**.html', '**.ico', '**.png', 'fonts', 'fonts/**', 'img', 'img/**'
                    ], dest: 'build/'}
                ]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['src/**.js', 'src/*/*.js'],
                tasks: ['requirejs']
            },
            css: {
                files: ['src/*.scss'],
                tasks: ['sass', 'cssmin']
            },
            other: {
                files: 'src/**',
                tasks: ['copy']
            }
        },
        sass: {
            dist: {
                files: {
                    'src/main.css': 'src/main.scss'
                }
            }
        },
        cssmin: {
            add_banner: {
                options: {
                    banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'build/main.css': ['src/main.css']
                }
            }
        },

        hashres: {
          // Global options
          options: {
            // Optional. Encoding used to read/write files. Default value 'utf8'
            encoding: 'utf8',
            // Optional. Format used to name the files specified in 'files' property.
            fileNameFormat: '${name}.${hash}.${ext}',
            renameFiles: true
          },
          js: {
            options: {
                matchFormat: '${ext}/${name}',
                replaceFormat: '${ext}/${name}.${hash}'
            },
            src: ['build/js/main.js'],
            dest: ['build/index.html']
          },
          css: {
            src: ['build/main.css'],
            dest: ['build/index.html']
          }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-hashres');

    grunt.registerTask('default', ['clean', 'requirejs', 'sass', 'cssmin', 'copy', 'hashres']);
};
