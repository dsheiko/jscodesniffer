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
* @module lib/Sniff/SyntaxTree/ParametersSpacing
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
		NAME = "ParametersSpacing",
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/ParametersSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	* @param {module:lib/TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		/**
		* @type {Mixin}
		*/
		var mixin = utils.Mixin( sourceCode, mediator, NAME );
		/** @lends module:lib/Sniff/SyntaxTree/ParametersSpacing.prototype */
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowParamPrecedingWhitespaces", "number", true );
				utils.validateRule( rule, "allowParamTrailingWhitespaces", "number", true );
				if ( !rule.exceptions ) {
					return false;
				}
				if ( rule.exceptions.singleParam ) {
					utils.validateRule( rule.exceptions.singleParam, "for", "array", true );
					this.validateRule( rule.exceptions.singleParam );
				}
				if ( rule.exceptions.firstParam ) {
					utils.validateRule( rule.exceptions.firstParam, "for", "array", true );
					this.validateRule( rule.exceptions.firstParam );
				}
				if ( rule.exceptions.lastParam ) {
					utils.validateRule( rule.exceptions.lastParam, "for", "array", true );
					this.validateRule( rule.exceptions.lastParam );
				}
			},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var tokenIt,
						expOpeningBrace,
						expClosingBrace;

				if ( ( node.type === "FunctionExpression" || node.type === "FunctionDeclaration" ) &&
					node.params && node.params.length && node.body ) {

					// find expression opening brace token
					expOpeningBrace = this.getExpOpeningBrace( node );
					// find expression closing brace token
					expClosingBrace = this.getExpClosingBrace( node );


					this.sniffFirst( rule, node, expOpeningBrace );
					// Checking preceding for each param
					node.params.forEach(function( el, i ){
						if ( node.params[ i - 1 ] && node.params[ i + 1 ] ) {
							// {< >param,< >param }
							tokenIt = tokenIterator
								.findByLeftPos( el.range[ 0 ] )
								.findGroupOpener( expOpeningBrace.range[ 1 ] );

							mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
								rule.allowParamPrecedingWhitespaces, "ParamPrecedingWhitespaces", "<" );
						}
					});

					// Checking trailing for the last param
					// { param, param< >}
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
					.findByLeftPos( node.params[ 0 ].range[ 0 ] )
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
					.findByLeftPos( node.params[ node.params.length - 1 ].range[ 0 ] )
					.findGroupCloser( node.range[ 1 ] + 1 )
					.get( 0 );
			},
			/**
			* Check the first param
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			* @param {TokenIterator} expOpeningBrace
			*/
			sniffFirst: function( rule, node, expOpeningBrace ) {
				var param, expected, tokenIt;

				if ( !node.params.length ) {
					return;
				}

				param = node.params[ 0 ];

				// Checking preceding space for the first param
				// {< >param, param }

				expected = rule.allowParamPrecedingWhitespaces;

				if ( rule.exceptions && rule.exceptions.firstParam &&
					mixin.matchesFor( rule.exceptions.firstParam, param.type ) ) {

					expected = rule.exceptions.firstParam.allowParamPrecedingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleParam && node.params.length === 1 &&
					mixin.matchesFor( rule.exceptions.singleParam, param.type ) ) {
						expected = rule.exceptions.singleParam.allowParamPrecedingWhitespaces;
				}

				// find param token in the interator
				tokenIt = tokenIterator
					.findByLeftPos( param.range[ 0 ] )
					.findGroupOpener( expOpeningBrace.range[ 1 ] );


				// between prev. token right pos and param left pos
				mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
					expected, "ParamPrecedingWhitespaces", "<" );
			},
			/**
			* Check the last param
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			* @param {TokenIterator} expOpeningBrace
			* @param {TokenIterator} expClosingBrace
			*/
			sniffLast: function( rule, node, expOpeningBrace, expClosingBrace ) {
				var param, expected, tokenIt;
				if ( !node.params.length ) {
					return;
				}

				param = node.params[ node.params.length - 1 ];

				// Checking preceding for the last param
				// foo( param,< >param )
				// also: foo( param,< >(((param))) )
				// For the first another sniff take care
				if ( node.params.length > 1 ) {

					// find param token in the interator
					tokenIt = tokenIterator
						.findByLeftPos( param.range[ 0 ] )
						.findGroupOpener( expOpeningBrace.range[ 1 ] );

					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowParamPrecedingWhitespaces, "ParamPrecedingWhitespaces", "<" );
				}

				// Checking trailing for the last param
				// { param, param< >}
				expected = rule.allowParamTrailingWhitespaces;

				if ( rule.exceptions && rule.exceptions.lastParam &&
					mixin.matchesFor( rule.exceptions.lastParam, param.type ) ) {
					expected = rule.exceptions.lastParam.allowParamTrailingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleParam && node.params.length === 1 &&
						mixin.matchesFor( rule.exceptions.singleParam, param.type ) ) {
						expected = rule.exceptions.singleParam.allowParamTrailingWhitespaces;
				}
				// find param token in the interator
				tokenIt = tokenIterator
					.findByRightPos( param.range[ 1 ] )
					.findGroupCloser( expClosingBrace.range[ 0 ] );

				// find next token: foo( param, param<>)
				// also: foo( param, (((param)))< >)
				mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ), expected, "ParamTrailingWhitespaces", ">" );
			}
		};
	};
	return Sniff;
});