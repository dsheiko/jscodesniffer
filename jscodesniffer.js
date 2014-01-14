/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
	* jshint unused:false
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/
// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* Executing jscs cli
	* @module jscodesniffer
	*/
define(function( require ) {
	"use strict";
	var MIN_REPORT_WIDTH = 32,
			DEFAULT_REPORT_WIDTH = 84,
			Sniffer = require( "./lib/Sniffer" ),
			Reporter = require( "./lib/Reporter" ),
			Dictionary = require( "./lib/Dictionary" ),
			Cli = require( "./lib/Cli" ),
			fs = require( "fs" ),
			path = require( "path" ),
			HELP_SCREEN = "Usage: jscs <path>\n" +
				"<path> - filename or dir to sniff\n" +
				"[--standard=<Standard>] - apply specified standard (Idiomatic, Jquery)\n" +
				"[--report-full] - full report with source codes\n" +
				"[--report-summary] - summary report\n" +
				"[--report=xml] - printing an XML report\n" +
				"[--report=checkstyle] - printing Jenkins-friendly checkstyle report\n" +
				"[--report-file=filePath] - write the report to the specified file path\n" +
				"[--highlight=0] - disable colors on reports\n" +
				"[--reportWidth=" + DEFAULT_REPORT_WIDTH + "] - How many columns wide screen reports should be printed\n";
	/**
	* @constructor
	* @alias module:jscodesniffer
	* @param {string[]} argv
	* @param {string} cwd
	*/
	return function( argv, cwd ) {
		var
			/**
			* Default options
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
			where = ".",
			cli = new Cli( fs, path );

		if ( argv.length < 3 ) {
			console.log( HELP_SCREEN );
			process.exit( 1 );
		}

		where = cli.findPathInCliArgs( argv );
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

		if ( options.report === "checkstyle" || options.report === "xml" ) {
			options.highlight = "0";
		}

		reporter = new Reporter();
		sniffer = new Sniffer();
		dictionary = new Dictionary();

		rulesetOverrides = cli.readRealtimeConfig( cwd );

		cli.applyToEveryFileInPath( where, function( pathArg, data ) {
			var logger;
			options.src = pathArg;
			try {
				logger = sniffer.getTestResults( data, options, rulesetOverrides );
				reporter.add( pathArg, dictionary.translateBulk( logger.getMessages() ), options.standard );
			} catch ( e ) {
				console.error( e );
			}
		});

		if ( options.report === "checkstyle" && typeof options["report-file"] !== "undefined" ) {
			existingReportBody = cli.extractExistingReportBody( options["report-file"] );
		}

		formatter = reporter.loadFormatter( options.report, options );
		stdout = reporter.print( formatter, ( options.highlight === "1" ), existingReportBody );

		if ( stdout.length ) {
			if ( typeof options["report-file"] !== "undefined" ) {
					fs.writeFileSync( options["report-file"], stdout, "utf-8" );
			} else {
					console.error( stdout );
			}
			process.exit( 1 );
		}
	};
});

