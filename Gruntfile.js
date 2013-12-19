/*jshint node:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha-cli");

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: ["lib/**/*.js", "standard/**/*.js"]
        },
        mochacli: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/unit-tests.js']
            }
        }
    });

  grunt.registerTask("test", ["mochacli"]);
  grunt.registerTask("default", ["test"]);

};
