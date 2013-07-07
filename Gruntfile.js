/* global module */

module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-shell-spawn');

    grunt.registerTask('default', ['requirejs', 'sass', 'cssmin', 'copy']);
};