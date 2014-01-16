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
	* @module Sniff/SyntaxTree/OperatorSpacing
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
		NAME = "OperatorSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/OperatorSpacing
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	* @param {TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		var mixin = utils.Mixin( sourceCode, mediator, NAME );
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowOperatorPrecedingWhitespaces", "number", true );
				utils.validateRule( rule, "allowOperatorTrailingWhitespaces", "number", true );
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

				if ( ( node.type === "VariableDeclarator" ) &&
					node.id && node.init ) {

					leftBoundary = node.range[ 0 ];
					rightBoundary = node.range[ 1 ];

					// var id< >= init;
					tokenIt = tokenIterator
						.findByRightPos( node.id.range[ 1 ] )
						.findGroupCloser( rightBoundary );
					// id (0), operator (1)
					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces");

					// var id =< >init;
					tokenIt = tokenIterator
						.findByRightPos( node.init.range[ 0 ] )
						.findGroupOpener( leftBoundary );
					// operator (-1), init (0)
					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorTrailingWhitespaces");
				}

				if ( ( node.type === "AssignmentExpression" || node.type === "BinaryExpression" ) &&
					node.left && node.right && node.operator ) {

					// left< >operator right
					tokenIt = tokenIterator
						.findByLeftPos( node.left.range[ 0 ] )
						.findGroupOpener( leftBoundary );

					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces");

					// left operator< >right
					tokenIt = tokenIterator
						.findByRightPos( node.right.range[ 1 ] )
						.findGroupCloser( rightBoundary );

					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorTrailingWhitespaces");
				}
			}
		};
	};
	return Sniff;
});