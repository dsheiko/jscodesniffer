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
        },
				jscs: {
					test: {
						options: {
							"standard": "Jquery"
						},
						all: [ "./lib", "./jscs-module.js" ]
					}
				}
    });

	grunt.registerMultiTask( 'jscs', 'Run jscs', function() {
		var argv = [
					"node",
					"jscs",
					( "--standard=" + grunt.task.current.data.options.standard || "Jquery" ),
          "--report-full"
				],
				lArgv,
				jscs = require( "./jscs-module" ),
				folders = grunt.task.current.data.all;


		lArgv = argv.concat( folders );
		grunt.log.writeln( "Starting jscs on `" + folders.join( " " ) + "`" );
		grunt.verbose.writeln( 'Exec: ' + lArgv.join(" ") );
		jscs( lArgv, process.cwd() );

	});

  grunt.registerTask( "test", [ "jshint", "mochacli", "jscs" ] );
  grunt.registerTask( "default", [ "test" ] );

};
