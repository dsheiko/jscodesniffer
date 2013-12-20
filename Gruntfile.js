module.exports = function(grunt) {

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-mocha-cli" );

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            all: [ "lib/**/*.js", "standard/**/*.js", "test/*.js" ]
        },
        mochacli: {
            test: {
                options: {
                    reporter: "spec"
                },
                src: [ "test/unit-tests.js" ]
            }
        }
    });

  grunt.registerTask( "test", [ "jshint", "mochacli" ] );
  grunt.registerTask( "default", [ "test" ] );

};
