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
	* A module representing Reporter
	* @module Reporter
	*/
define(function( require ) {
	var utils = require( "./Utils" ),
		/**
		* Collection of reports per file
		* @type {array}
		*/
		reports = [];
		/**
		* Report manager
		* @constructor
		* @alias module:Reporter
		* @param {function} requireContainer
		*/
	return function( requireContainer ) {
	var formatter;
	// Dependency injection
	requireContainer = requireContainer || require;
	return {
		/**
		* Formatter factory
		* @param {string} formatterName
		* @param {Object} options
		* @return {Object}
		*/
		loadFormatter: function( formatterName, options ) {
		try {
			formatterName = utils.ucfirst( formatterName );
			formatter = new ( requireContainer( "./Formatter/" + formatterName ) )( options || {} );
		} catch ( e ) {
			throw new ReferenceError( "Cannot find " + formatterName + " formatter " );
		}
		return formatter;
		},
		/**
		* Add report per file
		* @param {string} path
		* @param {Array} messages
		* @param {string} standard
		*/
		add: function( path, messages, standard ) {
		reports.push({
			path: path,
			messages: messages,
			standard: standard
		});
		},
		/**
		* Get all collected reports data
		* @returns {array}
		*/
		getData: function() {
		return reports;
		},

		/**
		* Render report
		* @param {string|Object} - formatter
		* @param {boolean} highlight
		* @param {string} injectionContent - OPTIONAL content to extend report body. Handy when we extend already
		* existing checkstyle.xml
		* @return {string} report content
		*/
		print: function( formatter, highlight, injectionContent ) {
			var out = injectionContent ? injectionContent : "";

			if ( typeof formatter === "string" ) {
			formatter = this.loadFormatter( formatter );
			}
			if ( typeof formatter !== "object" ) {
			throw new TypeError( "Invalid formatter provided" );
			}

			reports.forEach(function( report ){
				out += formatter.report( report.path, report.messages, report.standard );
			});

			out = out ? formatter.header() + out + formatter.footer() : "";

			return this.interpretateMarkup( out, highlight );
		},

		/**
		* Replace [color:red]..[/color] with console color codes
		* @param {string} markup
		* @param {boolean} highlight
		* @return {string}
		*/
		interpretateMarkup: function( markup, highlight ) {
			var matches = markup.match( /\[color:[a-z\s]+\]/gm ),
				colors = {};
			matches && matches.forEach(function( match ){
				var color = match.replace( /\[color:([a-z\s]+)\]/, "$1" );
				colors[ color ] = color;

			});
			colors && Object.keys( colors ).forEach(function( color ) {
				var re = new RegExp( "(\\[color:" + color + "\\])", "gm" ),
					code = utils.CONSOLE_COLORS[ color ] || utils.CONSOLE_COLORS.white;
				markup = highlight ? markup.replace( re, "\033[" + code + "m" ) : markup.replace( re, "" );
			});
			markup = highlight ?
			markup = markup.replace( /(\[\/color\])/gm, utils.CONSOLE_RESET_COLOR ) :
			markup = markup.replace( /(\[\/color\])/gm, "" );

			return markup;
		}
	};
	};

});
