/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* jscs standard:Jquery
	* jshint unused:false
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module providing common utilites for sniffers
	* @module Sniff/Utils
	*/
define(function() {
"use strict";
	/**
	* @constructor
	* @alias module:Sniff/Utils
	*/
	return {
		/**
		* Throw exception if the rule is invalid (TypeError)
		* @access public
		* @param {object} rule
		* @param {string} prop
		* @param {string} type
		* @param {boolean} isRequired
		*/
		validateRule: function( rule, prop, type, isRequired ) {
			if ( !isRequired && !rule.hasOwnProperty( prop ) ) {
				return;
			}
			if ( type === "array" ) {
				if ( !Array.isArray( rule[ prop ] ) ) {
					throw new TypeError( "rule." + prop + " must be a " + type );
				}
			return;
			}
			if ( rule.hasOwnProperty( prop ) && typeof rule[ prop ] !== type ) {
				throw new TypeError( "rule." + prop + " must be a " + type );
			}
		},
		
			/**
			 * @constructor
			 * @param {SourceCode} sourceCode
			 * @param {Mediator} mediator
			 * @param {string} sniffName
			 */
			Mixin: function( sourceCode, mediator, sniffName ) {
				return {
					/**
					* Report to the mediator if the fragment between lPos and rPos doesn't match expected
					* if it's not multiline
					*
					* @access protected
					* @param {number} lToken
					* @param {number} rToken
					* @param {number} expected
					* @param {string} errorCode
					*/
					sniffExcerpt: function( lToken, rToken, expected, errorCode ) {
						var excerpt, lPos, rPos;
						// Something wrong
						if ( typeof lToken === "undefined" && typeof rToken === "undefined" ) {
							throw new TypeError( "Both given tokens undefined" );
						}
						// Prev. token out of the source range
						if ( typeof lToken === "undefined" ) {
							lToken = rToken;
						}
						// Next. token out of the source range
						if ( typeof rToken === "undefined" ) {
							rToken = lToken;
						}
						lPos = lToken.range[ 1 ];
						rPos = rToken.range[ 0 ];
						excerpt = sourceCode.extract( lPos, rPos );
						if ( excerpt.find( "\n" ) === -1 ) {
							if ( excerpt.length() !== expected ) {
								mediator.publish( "violation", sniffName, errorCode, [ lPos, rPos ], {
									start: lToken.loc.end,
									end: rToken.loc.start
								}, {
									actual: excerpt.length(),
									expected: expected,
									excerpt: excerpt.get(),
									trace: ".." + sourceCode.extract( lPos - 1, rPos + 1 ).get() + ".."
								});
							}
						}
					}
				};
			}

	};
});