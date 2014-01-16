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
	* @module Sniff/SyntaxTree/ObjectLiteralSpacing
	* @param {function} require
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "ObjectLiteralSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ObjectLiteralSpacing
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
				utils.validateRule( rule, "allowKeyPrecedingWhitespaces", "number", true );
				utils.validateRule( rule, "allowKeyTrailingWhitespaces", "number", true );
				utils.validateRule( rule, "allowValuePrecedingWhitespaces", "number", true );
				utils.validateRule( rule, "allowValueTrailingWhitespaces", "number", true );
			},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var that = this,
						tokenIt,
						leftBoundary,
						rightBoundary;

				// a = { prop: 1 }
				if ( node.type === "ObjectExpression" && node.properties.length ) {

					leftBoundary = node.range[ 0 ];
					rightBoundary = node.range[ 1 ];

					// Checking preceding for each property
					node.properties.forEach(function( prop, i ){
						var tokenIt;

						// {< >key: value<, >key: value }
						tokenIt = tokenIterator
							.findByLeftPos( prop.key.range[ 0 ] )
							.findGroupOpener( leftBoundary );

						that.sniff( tokenIt.get( -1 ).range[ 1 ], tokenIt.get( 0 ).range[ 0 ],
							rule.allowKeyPrecedingWhitespaces, "ObjectPropertyKeyPrecedingSpacing", {
							start: tokenIt.get( -1 ).loc.end,
							end: tokenIt.get( 0 ).loc.start
						});

						// { key<>: value, key<>: value }
						tokenIt = tokenIterator
							.findByRightPos( prop.key.range[ 1 ] )
							.findGroupCloser( rightBoundary );

						that.sniff( tokenIt.get( 0 ).range[ 1 ], tokenIt.get( 1 ).range[ 0 ],
							rule.allowKeyTrailingWhitespaces, "ObjectPropertyKeyTrailingSpacing", {
							start: tokenIt.get( 0 ).loc.end,
							end: tokenIt.get( 1 ).loc.start
						});

						// { key:< >value, key:< >value }
						tokenIt = tokenIterator
							.findByLeftPos( prop.value.range[ 0 ] )
							.findGroupOpener( leftBoundary );

						if ( prop.value.type !== "NewExpression" ) {
							that.sniff( tokenIt.get( -1 ).range[ 1 ], tokenIt.get( 0 ).range[ 0 ],
								rule.allowValuePrecedingWhitespaces, "ObjectPropertyValuePrecedingSpacing", {
									start: tokenIt.get( -1 ).loc.end,
									end: tokenIt.get( 0 ).loc.start
							});
						}
					});


					// Checking trailing for the last property
					// { key: value, key: value< >}
					tokenIt = tokenIterator
						.findByRightPos( node.properties[ node.properties.length - 1 ].value.range[ 1 ] )
						.findGroupCloser( rightBoundary );

					that.sniff( tokenIt.get( 0 ).range[ 1 ], tokenIt.get( 1 ).range[ 0 ],
						rule.allowValueTrailingWhitespaces, "ObjectPropertyValueTrailingSpacing", {
						start: tokenIt.get( 0 ).loc.end,
						end: tokenIt.get( 1 ).loc.start
					});
				}
			},


			/**
			* Find position of `;`
			* @access protected
			* @param {number} lPos
			* @param {number} rPos
			* @returns {number}
			*/
			getSemicolonPos: function( lPos, rPos ) {
				var relPos = sourceCode.extract( lPos, rPos ).find( ":" );
				return relPos === -1 ? lPos : lPos + relPos;
			},
			/**
			* Find position of `,`
			* @access protected
			* @param {number} lPos
			* @param {number} rPos
			* @returns {number}
			*/
			getCommaPos: function( lPos, rPos ) {
				var relPos = sourceCode.extract( lPos, rPos ).find( "," );
				return relPos === -1 ? lPos : lPos + relPos;
			},

			/**
			* @typedef Loc
			* @type {object}
			* @property {{line: number, column: number}} start
			* @property {{line: number, column: number}} end
			*/

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
				var excerpt = sourceCode.extract( lPos, rPos );
				if ( excerpt.find( "\n" ) === -1 ) {
					if ( excerpt.length() !== expected ) {
						mediator.publish( "violation", NAME, errorCode, [ lPos, rPos ], loc, {
							actual: excerpt.length(),
							expected: expected,
							excerpt: excerpt.get(),
							trace: ".." + sourceCode.extract( lPos - 1, rPos + 1 ).get() + ".."
						});
					}
				}
			}
		};
	};
	return Sniff;
});