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
* @typedef Loc
* @type {object}
* @property {{line: number, column: number}} start
* @property {{line: number, column: number}} end
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
				var that = this, expOpeningBrace, expClosingBrace;

				if ( node.type === "CallExpression" && node[ "arguments" ] && node.callee ) {

					// Ignore for nesting if the corresponding ruleset is disabled
					if ( rule.ifNesting === false && node.isNesting ) {
						return;
					}
					// Override rules when nesting and corresponding rules defined
					if ( rule.ifNesting && node.isNesting ) {
						rule = rule.ifNesting;
					}

					if ( !node[ "arguments" ].length ) {
						return;
					}

					// find expression opening brace token
					expOpeningBrace = this.getExpOpeningBrace( node );

					// find expression closing brace token
					expClosingBrace = this.getExpClosingBrace( node );


					this.sniffFirst( rule, node, expOpeningBrace );

					// Checking preceding for each argument
					node[ "arguments" ].forEach(function( el, i ){
						var tokenIt;
						// foo{ arg,< >arg }
						// also: foo{ arg,< >(((arg))) }
						// not the first and not the last
						if ( node[ "arguments" ][ i - 1 ] && node[ "arguments" ][ i + 1 ] ) {

							// find argument token in the interator
							tokenIt = tokenIterator
								.findByPos( el.range[ 0 ] )
								.findGroupOpener( expOpeningBrace.range[ 1 ] );

							that.sniff( el, tokenIt.get( -1 ).range[ 1 ], tokenIt.get( 0 ).range[ 0 ],
								rule.allowArgPrecedingWhitespaces, "ArgPrecedingWhitespaces", {
									start: tokenIt.get( -1 ).loc.end,
									end: tokenIt.get( 0 ).loc.start
							});
							// No need to check trailing for non-closing args. They are followed by comma and
							// that will be checked by comma sniff
						}
					});

					this.sniffLast( rule, node, expOpeningBrace, expClosingBrace );

				}
			},
			/**
			* @param {Object} node
			* @returns {Object} token
			*/
			getExpOpeningBrace: function( node ){
				return tokenIterator
						.findByPos( node[ "arguments" ][ 0 ].range[ 0 ] )
						.findGroupOpener( node.range[ 0 ] - 1 )
						.get( 0 );
			},
			/**
			* @param {Object} node
			* @returns {Object} token
			*/
			getExpClosingBrace: function( node ){
				return tokenIterator
						.findByPos( node[ "arguments" ][ node[ "arguments" ].length - 1 ].range[ 0 ] )
						.findGroupCloser( node.range[ 1 ] + 1 )
						.get( 0 );
			},

			/**
			* Run on the first argument
			* @param {Object} rule
			* @param {Object} node
			* @param {TokenIterator} expOpeningBrace
			*/
			sniffFirst: function( rule, node, expOpeningBrace ) {
				var arg, expected, tokenIt;

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

				// find argument token in the interator
				tokenIt = tokenIterator
					.findByPos( arg.range[ 0 ] )
					.findGroupOpener( expOpeningBrace.range[ 1 ] );


				// between prev. token right pos and arg left pos
				this.sniff( arg, tokenIt.get( -1 ).range[ 1 ], tokenIt.get( 0 ).range[ 0 ],
					expected, "ArgPrecedingWhitespaces", {
						start: tokenIt.get( -1 ).loc.end,
						end: tokenIt.get( 0 ).loc.start
				} );
			},
			/**
			* Run on the last argument
			* @param {Object} rule
			* @param {Object} node
			* @param {TokenIterator} expOpeningBrace
			* @param {TokenIterator} expClosingBrace
			*/
			sniffLast: function( rule, node, expOpeningBrace, expClosingBrace ) {
				var arg, expected, tokenIt;
				if ( !node[ "arguments" ].length ) {
					return;
				}

				arg = node[ "arguments" ][ node[ "arguments" ].length - 1 ];

				// Checking preceding for the last argument
				// foo( arg,< >arg )
				// also: foo( arg,< >(((arg))) )
				// For the first another sniff take care
				if ( node[ "arguments" ].length > 1 ) {

					// find argument token in the interator
					tokenIt = tokenIterator
						.findByPos( arg.range[ 0 ] )
						.findGroupOpener( expOpeningBrace.range[ 1 ] );

					this.sniff( arg, tokenIt.get( -1 ).range[ 1 ], tokenIt.get( 0 ).range[ 0 ],
						rule.allowArgPrecedingWhitespaces, "ArgPrecedingWhitespaces", {
						start: tokenIt.get( -1 ).loc.end,
						end: tokenIt.get( 0 ).loc.start
					});
				}

				// Checking trailing for the last argument
				// { arg, arg< >}
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
				// find argument token in the interator
				tokenIt = tokenIterator
					.findByPos( arg.range[ 0 ] )
					.findGroupCloser( expClosingBrace.range[ 0 ] );

				// find next token: foo( arg, arg<>)
				// also: foo( arg, (((arg)))< >)
				this.sniff( arg, tokenIt.get( 0 ).range[ 1 ], tokenIt.get( 1 ).range[ 0 ], expected, "ArgTrailingWhitespaces", {
					start: tokenIt.get( 0 ).loc.end,
					end: tokenIt.get( 1 ).loc.start
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