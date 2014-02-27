/*
* @package jscodesniffer
* @author sheiko
* @license MIT
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
* jscs standard:Jquery
* jshint unused:false
* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
*/
/**
* A module representing a formatter.
* @module lib/Formatter/Full
*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}

define(function( require ) {
"use strict";
	/**
	* @constructor
	* @alias module:lib/Formatter/Full
	* @param {Object} config
	*/
	return function( config ) {
	/**
	* @type {module:lib/Utils}
	*/
	var utils = require( "../Utils" );
		/** @lends module:lib/Formatter/Full.prototype */
		return {
			/**
			* Render header of the report
			* @access public
			* @returns {string}
			*/
			header: function() {
				return "\n DETAILED REPORT\n";
			},
			/**
			* Render body of the report
			* @access public
			* @param {string} path
			* @param {Object[]} messages
			* @returns {string}
			*/
			report: function( path, messages, standard ) {
				var hrPlain = utils.repeatStr( "-", config.reportWidth ) + "\n",
					hrStarred = "+" + utils.repeatStr( "-", config.reportWidth - 1 ) + "\n",
					header = "\n [color:light red]FILE: " + path + " violates " + standard + " standard [/color]\n" +
						hrPlain +
						" FOUND " + messages.length + " ERROR(S)\n" +
						hrStarred +
						" LINE  | COLUMN   | MESSAGE \n" +
						hrStarred,
					footer = hrPlain + "\n",
					out = "";
				if ( !messages.length ) {
					return "";
				}
				out += header;
				messages.forEach(function( log ){
					var message = utils.wordwrap( "[color:dark gray]" + log.sniff + ":[/color] " +
					log.message, config.reportWidth - 20 );
					message = message.split( "\n" ).join( "\n       |          | " );

					out += ( " " + utils.sprintf( "%5s", log.loc.start.line ) +
						" | " + utils.sprintf( "%8s", log.loc.start.column ) +
						" | " + message + "\n" );
				});
				out += footer;
				return out;
			},
			/**
			* Render footer of the report
			* @access public
			* @returns {string}
			*/
			footer: function() {
				return "";
			}
		};
	};
});