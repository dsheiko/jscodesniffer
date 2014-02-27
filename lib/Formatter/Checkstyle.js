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
* @module lib/Formatter/Checkstyle
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

define(function() {
"use strict";
	/**
	* @constructor
	* @alias module:lib/Formatter/Checkstyle
	* @param {Object} config
	*/
	return function( config ) {
		/** @lends module:lib/Formatter/Checkstyle.prototype */
		return {
			/**
			* Render header of the report
			* @access public
			* @returns {string}
			*/
			header: function() {
				return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + "\n" +
					"  <checkstyle version=\"" + config.version + "\">" + "\n";
			},
			/**
			* Render body of the report
			* @access public
			* @param {string} path
			* @param {Object[]} messages
			* @returns {string}
			*/
			report: function( path, messages ) {
				var out = "  <file name=\"" + path + "\">" + "\n";
				if ( !messages.length ) {
					return "";
				}
				messages.forEach(function( log ){
					var re = /[\'\"\n\r]/gm;
					out += "    <error line=\"" + log.loc.start.line +
						"\" column=\"" + log.loc.start.column + "\" source=\"" + log.errorCode +
						"\" severity=\"error\" message=\"" + log.message.replace( re, "" ) + "\" />" + "\n";
				});
				return out + "  </file>" + "\n";
			},
			/**
			* Render footer of the report
			* @access public
			* @returns {string}
			*/
			footer: function() {
				return "</checkstyle>" + "\n";
			}
		};
	};
});