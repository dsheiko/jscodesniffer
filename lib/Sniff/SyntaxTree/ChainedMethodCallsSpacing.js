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
* @module lib/Sniff/SyntaxTree/ChainedMethodCallsSpacing
*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
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
		NAME = "ChainedMethodCallsSpacing",
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/ChainedMethodCallsSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	* @param {module:lib/TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		/** @lends module:lib/Sniff/SyntaxTree/ChainedMethodCallsSpacing.prototype */
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowPrecedingPropertyWhitespaces", "number" );
			},

			/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} node
			*/
			run: function( rule, node ) {
				var tokenIt;

				if ( node.type === "MemberExpression" && node.object && node.property && node.computed === false ) {

					if ( rule.hasOwnProperty( "allowPrecedingPropertyWhitespaces" ) ) {
						// object.< >property
						tokenIt = tokenIterator.findByLeftPos( node.property.range[ 0 ] );
						this.sniff( node.property, tokenIt.get( -1 ).range[ 1 ], node.property.range[ 0 ],
							rule.allowPrecedingPropertyWhitespaces, "ChainedMethodCallsPrecedingPropertyWhitespaces" );
					}
				}
			},

			/**
			* Report to the mediator if the fragment between lPos and rPos doesn't match expected
			* if it's not multiline
			*
			* @access protected
			* @param {Object} node
			* @param {number} lPos
			* @param {number} rPos
			* @param {number} expected
			* @param {string} errorCode
			*/
			sniff: function( node, lPos, rPos, expected, errorCode ) {
				var excerpt = sourceCode.extract( lPos, rPos );

				if ( excerpt.find( "\n" ) === -1 ) {
					if ( excerpt.length() !== expected ) {
						mediator.publish( "violation", NAME, errorCode, [ lPos, rPos ], {
							start: node.loc.start,
							end: {
								line: node.loc.start.line,
								column: node.loc.start.column + ( rPos - lPos )
							}
						}, {
							actual: excerpt.length(),
							expected: expected,
							excerpt: excerpt.get(),
							trace: ".." + sourceCode.extract( lPos - 1, rPos + 1 ).get() + "..",
							where: "<"
						});
					}
				}
			}
		};
	};
	return Sniff;
});