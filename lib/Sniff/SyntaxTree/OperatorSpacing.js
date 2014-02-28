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
* @module lib/Sniff/SyntaxTree/OperatorSpacing
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
		NAME = "OperatorSpacing",
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/OperatorSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	* @param {module:lib/TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		/**
		* @type {Mixin}
		*/
		var mixin = utils.Mixin( sourceCode, mediator, NAME );
		/** @lends module:lib/Sniff/SyntaxTree/OperatorSpacing.prototype */
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
						rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces", "<" );

					// var id =< >init;
					tokenIt = tokenIterator
						.findByLeftPos( node.init.range[ 0 ] )
						.findGroupOpener( leftBoundary );
					// operator (-1), init (0)

					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorTrailingWhitespaces", ">" );
				}

				if ( ( node.type === "AssignmentExpression" || node.type === "BinaryExpression" ) &&
					node.left && node.right && node.operator ) {

					leftBoundary = node.range[ 0 ];
					rightBoundary = node.range[ 1 ];

					// left< >operator right
					tokenIt = tokenIterator
						.findByRightPos( node.left.range[ 1 ] )
						.findGroupCloser( rightBoundary );
					// left (0), operator (1)
					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorPrecedingWhitespaces", "<" );

					// left operator< >right
					tokenIt = tokenIterator
						.findByLeftPos( node.right.range[ 0 ] )
						.findGroupOpener( leftBoundary );
					// operator (-1), right (0)

					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowOperatorPrecedingWhitespaces, "OperatorTrailingWhitespaces", ">" );

				}
			}
		};
	};
	return Sniff;
});