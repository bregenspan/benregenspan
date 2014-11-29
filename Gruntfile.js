/* global module */

module.exports = function(grunt) {
    'use strict';

    // Semitic versioning?! What kind of anti-Semite would force
    // the Jews to use their own versioning?  --Sarah Palin
    var releaseTag = new Date().toISOString().replace(/\..+/, '').replace(/-/g, '.').replace(/:/g, '.').replace(/T/, '-');  // YYYY.MM.DD-HH.MM.SS

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["build/*"],

        shell: {
            serve: {
                command: 'cd build; python -m SimpleHTTPServer 8080'
            }
        },

        requirejs: {
            options: {
                baseUrl: "./src/js"
            },
            main: {
                options: {
                    name: "main",
                    mainConfigFile: "./src/js/main.js",
                    out: "./build/js/main.js"
                }
            },
            404: {
                options: {
                    name: "404",
                    mainConfigFile: "./src/js/404.js",
                    out: "./build/js/404.js"
                }
            }
        },

        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/', src: [
                        'js/lib/require.js', '**.html', '**.ico', '**.png', 'fonts', 'bing/**', 'fonts/**', 'img', 'img/**', 'CNAME'
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
                files: ['src/scss/*.scss'],
                tasks: ['sass', 'cssmin']
            },
            other: {
                files: 'src/**',
                tasks: ['copy']
            }
        },
        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'src/main.css': 'src/scss/main.scss'
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
        },

        gitRemoteTag: {
            release: {
                options: {
                    tag: releaseTag
                }
            }
        },

        'gh-pages': {
            options: {
                base: 'build',
                branch: 'master',
                message: 'Auto-generated commit',
                repo: 'git@github.com:bregenspan/bregenspan.github.io.git',
                tag: releaseTag 
            },
            src: '**'
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
    grunt.loadNpmTasks('grunt-git-remote-tag');
    grunt.loadNpmTasks('grunt-gh-pages');

    // build
    grunt.registerTask('default', ['clean', 'requirejs', 'sass', 'cssmin', 'copy', 'hashres']);
 
    // build + serve local
    grunt.registerTask('local', ['default', 'shell:serve']);

    // build + deploy
    grunt.registerTask('deploy', ['default', 'gitRemoteTag', 'gh-pages']);
};
