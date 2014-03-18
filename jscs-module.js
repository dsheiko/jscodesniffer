/*
* @package jscodesniffer
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* @jscs standard:Jquery
* jshint unused:false
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/

/**
* Executing jscs cli
* @module jscs-module
* @requires module:lib/Sniffer
* @requires module:lib/Reporter
* @requires module:lib/Dictionary
* @requires module:lib/Cli
*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
* @param {function} require
*/
define(function( require ) {
	"use strict";
			/**
			* @constant
			* @default
			* @memberOf module:jscs-module
			* @type {number}
			* @access private
			*/
	var MIN_REPORT_WIDTH = 32,
			/**
			* @constant
			* @default
			* @memberOf module:jscs-module
			* @type {number}
			* @access private
			*/
			DEFAULT_REPORT_WIDTH = 84,
			/**
			* @memberOf module:jscs-module
			* @type {module:lib/Sniffer}
			* @access private
			*/
			Sniffer = require( "./lib/Sniffer" ),
			/**
			* @memberOf module:jscs-module
			* @type {module:lib/Reporter}
			* @access private
			*/
			Reporter = require( "./lib/Reporter" ),
			/**
			* @memberOf module:jscs-module
			* @type {module:lib/Dictionary}
			* @access private
			*/
			Dictionary = require( "./lib/Dictionary" ),
			/**
			* @memberOf module:jscs-module
			* @type {module:lib/Cli}
			* @access private
			*/
			Cli = require( "./lib/Cli" ),
			/**
			* @memberOf module:jscs-module
			* @type {function}
			* @access private
			*/
			fs = require( "fs" ),
			/**
			* @memberOf module:jscs-module
			* @type {function}
			* @access private
			*/
			path = require( "path" ),
			/**
			* @constant
			* @default
			* @memberOf module:jscs-module
			* @type {number}
			* @access private
			*/
			HELP_SCREEN = "Usage: jscs <path> <path>..\n" +
				"<path> - filename or dir to sniff\n" +
				"[--standard=<Standard>] - apply specified standard (Idiomatic, Jquery)\n" +
				"[--report-full] - full report with source codes\n" +
				"[--report-summary] - summary report\n" +
				"[--report=xml] - printing an XML report\n" +
				"[--report=checkstyle] - printing Jenkins-friendly checkstyle report\n" +
				"[--report-file=filePath] - write the report to the specified file path\n" +
				"[--highlight=0] - disable colors on reports\n" +
				"[--mode=silent] - suppress output if no violations found\n" +
				"[--reportWidth=" + DEFAULT_REPORT_WIDTH + "] - How many columns wide screen reports should be printed\n";
	/**
	* @constructor
	* @alias module:jscs-module
	* @param {string[]} argv
	* @param {string} [cwd]
	* @param {string} [srcCode]
	*/
	return function( argv, cwd, srcCode ) {
	/**
	* @typedef optionsDto
	* @type {object}
	* @property {string} standard - name of the coding style standard, e.g. Jquery
	* @property {string} highlight - colorize on ot ("1" or "0")
	* @property {string} report - reporter name
	* @property {number} reportWidth - width of the report
	*/
		var
			/**
			* Default options
			* @type {optionsDto}
			*/
			options = {
				standard: null,
				highlight: "1",
				report: "summary",
				reportWidth: DEFAULT_REPORT_WIDTH
			},
			stdout,
			reporter,
			formatter,
			sniffer,
			dictionary,
			existingReportBody,
			rulesetOverrides,
			/* @type {string[]} */
			where = ".",
			cli = new Cli( fs, path ),
			/**
			* Check if the configured report won't conflict with generic output wrapper
			* @return {Boolean}
			*/
			isSafeForStdOut = function() {
				return options.report !== "xml" &&
					options.report !== "checkstyle" &&
					options.mode !== "silent";
			};

		if ( argv.length < 3 ) {
			console.log( HELP_SCREEN );
			process.exit( 1 );
		}

		where = cli.findPathsInCliArgs( argv );
		options = cli.parseCliOptions( argv, options );

		if ( options.hasOwnProperty( "help" ) ) {
			console.log( HELP_SCREEN );
			process.exit( 1 );
		}

		options.version = cli.getProjectInfo().version;

		if ( options.reportWidth < MIN_REPORT_WIDTH ) {
				options.reportWidth = DEFAULT_REPORT_WIDTH;
		}

		if ( options.hasOwnProperty( "report-full" ) ) {
			options.report = "full";
		}

		if ( options.hasOwnProperty( "report-summary" ) ) {
			options.report = "summary";
		}

		if ( options.report === "checkstyle" || options.report === "xml" ||
			typeof options[ "report-file" ] !== "undefined" ) {
			options.highlight = "0";
		}

		reporter = new Reporter();
		sniffer = new Sniffer();
		dictionary = new Dictionary();

		rulesetOverrides = cwd ? cli.readRealtimeConfig( cwd ) : {};

		// If scrCode is povided from external module
		if ( srcCode ) {
			(function(){
				var logger = sniffer.getTestResults( srcCode, options, rulesetOverrides );
				reporter.add( cwd, dictionary.translateBulk( logger.getMessages() ), options.standard );
			}());
		} else {
			// For every given target
			where.forEach(function( targetPath ){
				// If requested externally paths are not of the cwd
				if ( cwd ) {
					targetPath = path.join( cwd, targetPath );
				}
				// Generic flow
				cli.applyToEveryFileInPath( targetPath, function( pathArg, data ) {
					var logger;
					options.src = pathArg;
					try {
						logger = sniffer.getTestResults( data, options, rulesetOverrides );
						reporter.add( pathArg, dictionary.translateBulk( logger.getMessages() ), options.standard );
					} catch ( err ) {
						console.error( err.message || err );
					}
				});
			});
		}

		if ( options.report === "checkstyle" && typeof options[ "report-file" ] !== "undefined" ) {
			existingReportBody = cli.extractExistingReportBody( options[ "report-file" ] );
		}

		formatter = reporter.loadFormatter( options.report, options );
		stdout = reporter.print( formatter, ( options.highlight === "1" ), existingReportBody );


		isSafeForStdOut() && cli.printHeader( options.version );

		if ( stdout.length ) {
			// Violations found
			if ( typeof options[ "report-file" ] !== "undefined" ) {
				fs.writeFileSync( options[ "report-file" ], stdout, "utf-8" );
			} else {
				console.error( stdout );
			}
			isSafeForStdOut() && cli.printFooter();
			process.exit( 1 );
		} else {
			// Success
			if ( isSafeForStdOut() ){
				cli.printSuccess( options.standard );
				cli.printFooter();
			}
		}

	};
});

