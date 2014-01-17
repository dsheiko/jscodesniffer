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
	* @module Sniff/SyntaxTree/UnaryExpressionIdentifierSpacing
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
		* @type {string}
		* @default
		*/
		NAME = "UnaryExpressionIdentifierSpacing",
		/**
		* @constant
		* @type {string[]}
		* @default
		*/
		IGNORE_OPERATORS = [ "delete", "in", "instanceof", "new", "this", "typeof", "void" ],
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/UnaryExpressionIdentifierSpacing
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
			utils.validateRule( rule, "allowTrailingWhitespaces", "number", true );
		},
		/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @access public
		* @param {Object} rule
		* @param {Object} node
		*/
		run: function( rule, node ) {
			var tokenIt,
					leftBoundary,
					rightBoundary;

			if ( node.type === "UnaryExpression" && node.argument && node.operator &&
				IGNORE_OPERATORS.indexOf( node.operator ) === -1 ) {

				leftBoundary = node.range[ 0 ];
				rightBoundary = node.range[ 1 ];

				tokenIt = tokenIterator
					.findByLeftPos( node.argument.range[ 0 ] )
					.findGroupOpener( leftBoundary );

				mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
					rule.allowTrailingWhitespaces, "UnaryExpressionValueTrailingSpacing" );
			}
		}
	};
};
	return Sniff;
});