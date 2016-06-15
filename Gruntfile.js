var path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        webpack: {
            build: {
                entry: './app/app.js',
                output: {
                    path: 'public',
                    filename: 'build.js'
                },
                module: {
                    loaders: [
                        {
                            test: /.js$/,
                            loader: 'babel-loader',
                            exclude: /node_modules/,
                            query: {
                                presets: ['es2015']
                            }
                        }
                    ]
                }
            }
        },
        execute: {
            target: {
                src: ['server.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['webpack:build']);
    grunt.registerTask('serve', ['webpack:build', 'execute']);
};