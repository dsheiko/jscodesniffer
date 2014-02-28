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
					( "--standard=" + grunt.task.current.data.options.standard || "Jquery" )
				],
				lArgv,
				jscs = require( "./jscs-module" ),
				folders = grunt.task.current.data.all;


		lArgv = argv.concat( folders );
		grunt.log.writeln( "Starting jscs on `" + folders.join( " " ) + "`" );
		grunt.verbose.writeln( 'Exec: ' + lArgv.join(" ") );
		jscs( lArgv, process.cwd() );

	});

	grunt.registerTask('jsdoc', 'Run jsdoc', function() {
    var exec = require('child_process').exec;
     grunt.log.writeln( 'Running jsdoc' );
     grunt.verbose.writeln( 'Exec: node ./node_modules/jsdoc/jsdoc ' );
     exec( "node node_modules/jsdoc/jsdoc.js -r ./lib -d build/doc -p", function( err, stdout ) {
      if ( stdout ) {
        grunt.log.write( stdout );
      }
      if ( err ) {
        grunt.fatal( err );
      }
      done();
    });
  });

  grunt.registerTask( "test", [ "jshint", "mochacli", "jscs" ] );
  grunt.registerTask( "default", [ "test" ] );

};
