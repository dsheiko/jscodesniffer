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
* A module representing a sniffer.
* @module lib/Sniff/Token/CommaPunctuatorSpacing
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
	* @param {function( string )} require
	*/
define(function( require ) {
"use strict";

		/**
		* @type {utilsSniff/Utils}
		*/
var utils = require( "../Utils" ),
		/**
		* @constant
		* @type {String}
		* @default
		*/
		NAME = "CommaPunctuatorSpacing",
	/**
	* @constructor
	* @alias module:lib/Sniff/Token/CommaPunctuatorSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
		/** @lends module:lib/Sniff/Token/CommaPunctuatorSpacing.prototype */
		return {
		/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "disallowPrecedingSpaces", "boolean", true );
			},
			/**
			* Run the sniffer according a given rule if a given TOKEN type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} token
			*/
			run: function( rule, token ) {

				if ( token.type !== "Punctuator" || token.value !== "," || !rule.disallowPrecedingSpaces ) {
					return;
				}

				if ( sourceCode.extract( token.range[ 0 ] - 1, token.range[ 0 ] ).find( " " ) !== -1 ) {
					mediator.publish( "violation", NAME, "CommaPrecedingSpacesNotAllowed", [
						token.range[ 0 ] - 1,
						token.range[ 0 ]
					], {
						start: {
							line: token.loc.start.line,
							column: token.loc.start.column - 1
						},
						end: {
							line: token.loc.start.line,
							column: token.loc.start.column
						}
					}, {
						excerpt: sourceCode.extract( token.range[ 0 ] - 1, token.range[ 0 ] ).get(),
						trace: ".." + sourceCode.extract( token.range[ 0 ] - 2, token.range[ 0 ] + 1 ).get() + "..",
						where: "<"
					});
				}
		}
	};
};
	return Sniff;
});