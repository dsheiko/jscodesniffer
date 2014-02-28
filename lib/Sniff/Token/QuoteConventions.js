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
* @module lib/Sniff/Token/QuoteConventions
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
		NAME = "QuoteConventions",
	/**
	* @constructor
	* @alias module:lib/Sniff/Token/QuoteConventions
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
		/** @lends module:lib/Sniff/Token/QuoteConventions.prototype */
		return {
		/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowDoubleQuotes", "boolean" );
				utils.validateRule( rule, "allowSingleQuotes", "boolean" );
			},
			/**
			* Run the sniffer according a given rule if a given TOKEN type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} token
			*/
			run: function( rule, token ) {

				if ( token.type !== "String" ) {
					return;
				}

				if ( rule.hasOwnProperty( "allowDoubleQuotes" ) && !rule.allowDoubleQuotes ) {
					token.value.substr( 0, 1 ) === "\"" && this.sniff( token, "QuoteConventionsDoubleQuotesNotAllowed" );
				}

				if ( rule.hasOwnProperty( "allowSingleQuotes" ) && !rule.allowSingleQuotes ) {
					token.value.substr( 0, 1 ) === "'" && this.sniff( token, "QuoteConventionsSingleQuotesNotAllowed" );
				}

			},
			/**
			* Report to the mediator
			* @access protected
			* @param {Object} token
			* @param {string} code
			*/
			sniff: function( token, code ) {
				mediator.publish( "violation", NAME, code, token.range, token.loc, {
					excerpt: sourceCode.extract( token.range[ 0 ], token.range[ 1 ] ).get(),
					trace: ".." + sourceCode.extract( token.range[ 0 ], token.range[ 1 ] ).get() + "..",
					where: ""
				});
			}
	};
};
	return Sniff;
});