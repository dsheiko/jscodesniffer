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
* @module lib/Formatter/Summary
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
/**
*
* @param {function} require
*/
define(function( require ) {
"use strict";
	/**
	* @type {module:lib/Utils}
	*/
	var utils = require( "../Utils" );
	/**
	* @constructor
	* @alias module:lib/Formatter/Summary
	* @param {Object} config
	*/
	return function( config ) {
	var fileCount = 0, errorCount = 0;
		/** @lends module:lib/Formatter/Summary.prototype */
		return {
			/**
			* Render header of the report
			* @access public
			* @returns {string}
			*/
			header: function() {
				var hrPlain = utils.repeatStr( "-", config.reportWidth ) + "\n";
				return "\n REPORT SUMMARY\n" +
					hrPlain +
					" FILE" + utils.repeatStr( " ", config.reportWidth - 12 ) + "ERRORS  \n" +
					hrPlain;
			},
			/**
			* Render body of the report
			* @access public
			* @param {string} path
			* @param {Object[]} messages
			* @returns {string}
			*/
			report: function( path, messages ) {
				if ( !messages.length ) {
					return "";
				}
				fileCount ++;
				errorCount += messages.length;
				return " " + utils.sprintf( "%" + ( config.reportWidth - 9 ) + "s", path ) + " " + messages.length + "\n";
			},
			/**
			* Render footer of the report
			* @access public
			* @returns {string}
			*/
			footer: function() {
				var hrPlain = utils.repeatStr( "-", config.reportWidth ) + "\n";
				return hrPlain +
					" A TOTAL OF " + errorCount + " ERROR(S) WERE FOUND IN " + fileCount + " FILE(S)\n" +
					hrPlain;
			}
		};
	};
});