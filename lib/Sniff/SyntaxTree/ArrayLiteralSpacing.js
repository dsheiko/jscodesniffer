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
* A module representing a sniffer.
* @module Sniff/SyntaxTree/ArrayLiteralSpacing
* @param {function} require
*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "ArrayLiteralSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ArrayLiteralSpacing
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	* @param {TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {

		return {
			/**
				* Check the contract
				* @access public
				* @param {Object} rule
				*/
				validateRule: function( rule ) {
					utils.validateRule( rule, "allowElementPrecedingWhitespaces", "number", true );
					utils.validateRule( rule, "allowElementTrailingWhitespaces", "number", true );
				},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var that = this, last, tokenIt;

				if ( node.type === "ArrayExpression" && node.elements && node.elements.length ) {

					// Checking preceding for each element
					node.elements.forEach(function( el ){
						var tokenIt;
						tokenIt = tokenIterator
							.findByLeftPos( el.range[ 0 ] )
							.findGroupOpener( node.range[ 0 ] );
						// [< >element<, >element ]
						// incl. [(((el)))]
						that.sniff( tokenIt.get( -1 ).range[ 1 ], tokenIt.get( 0 ).range[ 0 ],
							rule.allowElementPrecedingWhitespaces, "ArraylElementPrecedingSpacing", {
							start: tokenIt.get( -1 ).loc.end,
							end: tokenIt.get( 0 ).loc.start
						});
					});
					// Checking trailing for the last element
					// [ element, element< >]
					last = node.elements[ node.elements.length - 1 ];
					tokenIt = tokenIterator
						.findByRightPos( last.range[ 1 ] )
						.findGroupOpener( node.range[ 1 ] );

					this.sniff( tokenIt.get( 0 ).range[ 1 ], tokenIt.get( 1 ).range[ 0 ],
						rule.allowElementTrailingWhitespaces, "ArraylElementTrailingSpacing", {
							start: tokenIt.get( 0 ).loc.end,
							end: tokenIt.get( 1 ).loc.start
						});
				}
			},


			/**
			* Report to the mediator if the fragment between lPos and rPos doesn't match expected
			* if it's not multiline
			*
			* @access protected
			* @param {number} lPos
			* @param {number} rPos
			* @param {number} expected
			* @param {string} errorCode
			* @param {Loc} loc
			*/
			sniff: function( lPos, rPos, expected, errorCode, loc ) {
				var fragment = sourceCode.extract( lPos, rPos );
				if ( fragment.find( "\n" ) === -1 ) {
					if ( fragment.length() !== expected ) {
						mediator.publish( "violation", NAME, errorCode, [ lPos, rPos ], loc, {
							actual: fragment.length(),
							expected: expected,
							trace: ".." + sourceCode.extract( lPos - 1, rPos + 1 ).get() + ".."
						});
					}
				}
			}
		};
	};
	return Sniff;
});