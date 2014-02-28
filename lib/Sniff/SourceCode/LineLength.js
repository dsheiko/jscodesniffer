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
* @module lib/Sniff/SourceCode/LineLength
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
		NAME = "LineLength",
	/**
	* @constructor
	* @alias module:lib/Sniff/SourceCode/LineLength
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
	/** @lends module:lib/Sniff/SourceCode/LineLength.prototype */
	return {
		/**
		* Check the contract
		* @access public
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
			utils.validateRule( rule, "allowMaxLength", "number" );
			utils.validateRule( rule, "allowMinLength", "number" );
		},
		/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @access public
		* @param {Object} rule
		*/
		run: function( rule ) {
			var that = this,
				lines = sourceCode.asLines();

			if ( !rule.hasOwnProperty( "allowMaxLength" ) && !rule.hasOwnProperty( "allowMinLength" ) ) {
				return;
			}

			lines.forEach(function( line, inx ){
				var pos = lines.slice( 0, inx ).join( "\n" ).length;
				if ( rule.hasOwnProperty( "allowMaxLength" ) && line.length > rule.allowMaxLength ) {
					that.sniff( inx + 1, pos, line.length, rule.allowMaxLength, "ExceededLineMaxLength" );
				}
				if ( rule.hasOwnProperty( "allowMinLength" ) && line.length < rule.allowMinLength ) {
					that.sniff( inx + 1, pos, line.length, rule.allowMaxLength, "DeceedLineMinLength" );
				}
			});
		},
		/**
		* Report to the mediator if `actual` doesn't match `expected`
		*
		* @access protected
		* @param {number} line
		* @param {number} pos
		* @param {number} actual
		* @param {number} expected
		* @param {string} errorCode
		*/
		sniff: function( line, pos, actual, expected, errorCode ) {

			mediator.publish( "violation", NAME, errorCode, [ pos, pos + actual ], {
				start: {
					line: line,
					column: 0
				},
				end: {
					line: line,
					column: actual
				}
			}, {
				expected: expected,
				actual: actual,
				excerpt: sourceCode.extract( pos, pos + actual ).get(),
				trace: ".." + sourceCode.extract( pos, pos + actual ).get() + "..",
				where: ""
			});
		}
	};
};

	return Sniff;
});