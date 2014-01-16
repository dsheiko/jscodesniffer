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
	* @module Sniff/SyntaxTree/ParametersSpacing
	* @param {function} require
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
	* @alias module:Sniff/SyntaxTree/ParametersSpacing
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
				utils.validateRule( rule, "allowParamPrecedingWhitespaces", "number", true );
				utils.validateRule( rule, "allowParamTrailingWhitespaces", "number", true );
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


					// Checking preceding for each param

					node.params.forEach(function( el ){
						// {< >param,< >param }
						tokenIt = tokenIterator
							.findByLeftPos( el.range[ 0 ] )
							.findGroupOpener( expOpeningBrace.range[ 1 ] );

						mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
							rule.allowParamPrecedingWhitespaces, "ParamPrecedingWhitespaces" );
					});

					// Checking trailing for the last param
					// { param, param< >}
					tokenIt = tokenIterator
						.findByRightPos( node.params[ node.params.length - 1 ].range[ 1 ] )
						.findGroupCloser( expClosingBrace.range[ 0 ] );

					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowParamTrailingWhitespaces, "ParamTrailingWhitespaces" );

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
			}
		};
	};
	return Sniff;
});