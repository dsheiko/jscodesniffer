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
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing a sniffer.
	* @module Sniff/SyntaxTree/ArgumentsSpacing
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
		NAME = "ArgumentsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ArgumentsSpacing
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	* @param {TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		/**
		* @type {Mixin}
		*/
		var mixin = utils.Mixin( sourceCode, mediator, NAME );
		return {

			/**
			* Check the contract
			* @access public
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
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var expOpeningBrace, expClosingBrace;

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

							// Ignore cases: run( pNode || { type: null } ), run( ( a ? 1 : 2 ) )
							if ( [ "Identifier", "Literal" ].indexOf( el.type ) === -1 ) {
								return;
							}

							// find argument token in the interator
							tokenIt = tokenIterator
								.findByLeftPos( el.range[ 0 ] )
								.findGroupOpener( expOpeningBrace.range[ 1 ] );

							mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
								rule.allowArgPrecedingWhitespaces, "ArgPrecedingWhitespaces", "<" );
							// No need to check trailing for non-closing args. They are followed by comma and
							// that will be checked by comma sniff
						}
					});

					this.sniffLast( rule, node, expOpeningBrace, expClosingBrace );

				}
			},
			/**
			* Find opening brace for a given node [<(>(((1)))]
			* @access protected
			* @param {Object} node
			* @returns {Object} token
			*/
			getExpOpeningBrace: function( node ){
				return tokenIterator
						.findByLeftPos( node[ "arguments" ][ 0 ].range[ 0 ] )
						.findGroupOpener( node.range[ 0 ] - 1 )
						.get( 0 );
			},
			/**
			* Find closing brace for a given node [(((1))<)>]
			* @access protected
			* @param {Object} node
			* @returns {Object} token
			*/
			getExpClosingBrace: function( node ){
				return tokenIterator
						.findByLeftPos( node[ "arguments" ][ node[ "arguments" ].length - 1 ].range[ 0 ] )
						.findGroupCloser( node.range[ 1 ] + 1 )
						.get( 0 );
			},

			/**
			* Check the first argument
			* @access protected
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

				// Ignore cases: run( pNode || { type: null } ), run( ( a ? 1 : 2 ) )
				if ( [ "Identifier", "Literal" ].indexOf( arg.type ) === -1 ) {
					return;
				}

				// Checking preceding space for the first argument
				// {< >param, param }

				expected = rule.allowArgPrecedingWhitespaces;

				if ( rule.exceptions && rule.exceptions.firstArg &&
					mixin.matchesFor( rule.exceptions.firstArg, arg.type ) ) {
					expected = rule.exceptions.firstArg.allowArgPrecedingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleArg && node[ "arguments" ].length === 1 &&
					mixin.matchesFor( rule.exceptions.singleArg, arg.type ) ) {
					// Idiomatic: foo("bar");
					if ( arg.type !== "Literal" || typeof arg.value === "string" ) {
						expected = rule.exceptions.singleArg.allowArgPrecedingWhitespaces;
					}
				}

				// find argument token in the interator
				tokenIt = tokenIterator
					.findByLeftPos( arg.range[ 0 ] )
					.findGroupOpener( expOpeningBrace.range[ 1 ] );


				// between prev. token right pos and arg left pos
				mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
					expected, "ArgPrecedingWhitespaces", "<" );
			},
			/**
			* Check the last argument
			* @access protected
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

				// Ignore cases: run( pNode || { type: null } ), run( ( a ? 1 : 2 ) )
				if ( [ "Identifier", "Literal" ].indexOf( arg.type ) === -1 ) {
					return;
				}

				// Checking preceding for the last argument
				// foo( arg,< >arg )
				// also: foo( arg,< >(((arg))) )
				// For the first another sniff take care
				if ( node[ "arguments" ].length > 1 ) {

					// find argument token in the interator
					tokenIt = tokenIterator
						.findByLeftPos( arg.range[ 0 ] )
						.findGroupOpener( expOpeningBrace.range[ 1 ] );

					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowArgPrecedingWhitespaces, "ArgPrecedingWhitespaces", "<" );
				}

				// Checking trailing for the last argument
				// { arg, arg< >}
				expected = rule.allowArgTrailingWhitespaces;

				if ( rule.exceptions && rule.exceptions.lastArg &&
					mixin.matchesFor( rule.exceptions.lastArg, arg.type ) ) {
					expected = rule.exceptions.lastArg.allowArgTrailingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleArg && node[ "arguments" ].length === 1 &&
						mixin.matchesFor( rule.exceptions.singleArg, arg.type ) ) {
					// Idiomatic: foo("bar");
					if ( arg.type !== "Literal" || typeof arg.value === "string" ) {
						expected = rule.exceptions.singleArg.allowArgTrailingWhitespaces;
					}
				}
				// find argument token in the interator
				tokenIt = tokenIterator
					.findByRightPos( arg.range[ 1 ] )
					.findGroupCloser( expClosingBrace.range[ 0 ] );

				// find next token: foo( arg, arg<>)
				// also: foo( arg, (((arg)))< >)
				mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ), expected, "ArgTrailingWhitespaces", ">" );
			}

		};
	};
	return Sniff;
});