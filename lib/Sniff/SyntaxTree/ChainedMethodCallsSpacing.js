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
	* A module representing a sniffer.
	* @module Sniff/SyntaxTree/ChainedMethodCallsSpacing
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "ChainedMethodCallsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ChainedMethodCallsSpacing
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	* @param {TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		return {
			/**
			* Check contract
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowPrecedingPropertyWhitespaces", "number" );
			},

			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var tokenIt;

				if ( node.type === "MemberExpression" && node.object && node.property && node.computed === false ) {

					if ( rule.hasOwnProperty( "allowPrecedingPropertyWhitespaces" ) ) {
						// object.< >property
						tokenIt = tokenIterator.findByPos( node.property.range[ 0 ] );
						this.sniff( node.property, tokenIt.get( -1 ).range[ 1 ], node.property.range[ 0 ],
							rule.allowPrecedingPropertyWhitespaces, "ChainedMethodCallsPrecedingPropertyWhitespaces" );
					}
				}
			},

			/**
			* Report to the mediator if the fragment between lPos and rPos doesn't match expected
			* if it's not multiline
			*
			* @param {Object} node
			* @param {number} lPos
			* @param {number} rPos
			* @param {number} expected
			* @param {string} errorCode
			*/
			sniff: function( node, lPos, rPos, expected, errorCode ) {
				var fragment = sourceCode.extract( lPos, rPos );

				if ( fragment.find( "\n" ) === -1 ) {
					if ( fragment.length() !== expected ) {
						mediator.publish( "violation", NAME, errorCode, [ lPos, rPos ], {
							start: node.loc.start,
							end: {
								line: node.loc.start.line,
								column: node.loc.start.column + ( rPos - lPos )
							}
						}, {
							actual: fragment.length(),
							expected: expected
						});
					}
				}
			}
		};
	};
	return Sniff;
});