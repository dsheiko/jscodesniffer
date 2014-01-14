/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
	* jshint unused:false
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/

/**
 * @typedef Loc
 * @type {object}
 * @property {{line: number, column: number}} start
 * @property {{line: number, column: number}} end
 */

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing a sniffer.
	* @module Sniff/SyntaxTree/ArgumentsSpacing
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "ArgumentsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ArgumentsSpacing
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
				utils.validateRule( rule, "allowArgPrecedingWhitespaces", "number" );
				utils.validateRule( rule, "allowArgTrailingWhitespaces", "number" );
				utils.validateRule( rule, "exceptions", "object" );
				if ( !rule.exceptions ) {
					return false;
				}
				if ( rule.exceptions.singleArg ) {
					utils.validateRule( rule.exceptions.singleArg, "for", "array", true );
					this.validateRule( rule.exceptions.singleArg );
				}
				if ( rule.exceptions.firstArg ) {
					utils.validateRule( rule.exceptions.firstArg, "for", "array", true );
					this.validateRule( rule.exceptions.firstArg );
				}
				if ( rule.exceptions.lastArg ) {
					utils.validateRule( rule.exceptions.lastArg, "for", "array", true );
					this.validateRule( rule.exceptions.lastArg );
				}
				if ( rule.ifNesting ) {
					this.validateRule( rule.ifNesting );
				}
			},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var that = this;

				if ( node.type === "CallExpression" && node[ "arguments" ] && node.callee ) {

					// Ignore for nesting if the corresponding ruleset is disabled
					if ( rule.ifNesting === false && node.isNesting ) {
						return;
					}
					// Override rules when nesting and corresponding rules defined
					if ( rule.ifNesting && node.isNesting ) {
						rule = rule.ifNesting;
					}

					node[ "arguments" ] && this.sniffFirst( rule, node );

					// Checking preceding for each argument
					node[ "arguments" ].forEach(function( el, i ){
						var prevToken;
						// { argument<, >argument }
						// not the first and not the last
						if ( node[ "arguments" ][ i - 1 ] && node[ "arguments" ][ i + 1 ] ) {

							prevToken = tokenIterator.findByPos( el.range[ 0 ] ).get( -1 );

							that.sniff( el, prevToken.range[ 1 ], el.range[ 0 ], rule.allowArgPrecedingWhitespaces,
								"ArgPrecedingWhitespaces", {
								start: {
									line: prevToken.loc.end.line,
									column: prevToken.loc.end.column
								},
								end: {
									line: el.loc.start.line,
									column: el.loc.start.column
								}
							});
							// No need to check trailing for non-closing args. They are followed by comma and
							// that will be checked by comma sniff
						}
					});

					node[ "arguments" ] && this.sniffLast( rule, node );

				}
			},
			/**
			* Run on the first argument
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffFirst: function( rule, node ) {
				var arg, expected, prevToken;

				if ( !node[ "arguments" ].length ) {
					return;
				}

				arg = node[ "arguments" ][ 0 ];

				// Checking preceding space for the first argument
				// {< >param, param }

				expected = rule.allowArgPrecedingWhitespaces;

				if ( rule.exceptions && rule.exceptions.firstArg &&
					rule.exceptions.firstArg[ "for" ].indexOf( arg.type ) !== -1 ) {
					expected = rule.exceptions.firstArg.allowArgPrecedingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleArg && node[ "arguments" ].length === 1 &&
					rule.exceptions.singleArg[ "for" ].indexOf( arg.type ) !== -1 ) {
					// Idiomatic: foo("bar");
					if ( arg.type !== "Literal" || typeof arg.value === "string" ) {
						expected = rule.exceptions.singleArg.allowArgPrecedingWhitespaces;
					}
				}
				// find previous token: foo<(> arg,...
				prevToken = tokenIterator.findByPos( arg.range[ 0 ] ).get( -1 );

				// between prev. token right pos and arg left pos
				this.sniff( arg, prevToken.range[ 1 ], arg.range[ 0 ], expected, "ArgPrecedingWhitespaces", {
					start: {
						line: prevToken.loc.end.line,
						column: prevToken.loc.end.column
					},
					end: {
						line: arg.loc.start.line,
						column: arg.loc.start.column
					}
				} );
			},
			/**
			* Run on the last argument
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffLast: function( rule, node ) {
				var arg, expected, nextToken, prevToken;
				if ( !node[ "arguments" ].length ) {
					return;
				}

				arg = node[ "arguments" ][ node[ "arguments" ].length - 1 ];

				// Checking preceding for the last argument
				// { param,< >param }
				// For the first another sniff take care
				if ( node[ "arguments" ].length > 1 ) {
					prevToken = tokenIterator.findByPos( arg.range[ 0 ] ).get( -1 );
					this.sniff( arg, prevToken.range[ 1 ], arg.range[ 0 ], rule.allowArgPrecedingWhitespaces,
						"ArgPrecedingWhitespaces", {
						start: {
							line: prevToken.loc.end.line,
							column: prevToken.loc.end.column
						},
						end: {
							line: arg.loc.start.line,
							column: arg.loc.start.column
						}
					});
				}

				// Checking trailing for the last argument
				// { param, param< >}
				expected = rule.allowArgTrailingWhitespaces;

				if ( rule.exceptions && rule.exceptions.lastArg &&
					rule.exceptions.lastArg[ "for"  ].indexOf( arg.type ) !== -1 ) {
					expected = rule.exceptions.lastArg.allowArgTrailingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleArg && node[ "arguments" ].length === 1 &&
						rule.exceptions.singleArg[ "for" ].indexOf( arg.type ) !== -1 ) {
					// Idiomatic: foo("bar");
					if ( arg.type !== "Literal" || typeof arg.value === "string" ) {
						expected = rule.exceptions.singleArg.allowArgTrailingWhitespaces;
					}
				}
				// find next token: foo( arg, arg <)>
				nextToken = tokenIterator.findByPos( arg.range[ 0 ] ).get( 1 );

				this.sniff( arg, arg.range[ 1 ], nextToken.range[ 0 ], expected, "ArgTrailingWhitespaces", {
					start: {
						line: arg.loc.end.line,
						column: arg.loc.end.column
					},
					end: {
						line: nextToken.loc.start.line,
						column: nextToken.loc.start.column
					}
				});
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
			* @param {Loc} loc
			*/
			sniff: function( node, lPos, rPos, expected, errorCode, loc ) {
				var fragment = sourceCode.extract( lPos, rPos ).filter( "," );
				// Ignore cases: run( pNode || { type: null } ), run( ( a ? 1 : 2 ) )
				if ( [ "Identifier", "Literal" ].indexOf( node.type ) === -1 ) {
					return;
				}
				if ( fragment.find( "\n" ) === -1 && fragment.find( "/*" ) === -1 ) {
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