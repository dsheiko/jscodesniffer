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
* @module Sniff/SyntaxTree/ArrayLiteralSpacing
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
		NAME = "ArrayLiteralSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ArrayLiteralSpacing
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
					utils.validateRule( rule, "allowElementPrecedingWhitespaces", "number", true );
					utils.validateRule( rule, "allowElementTrailingWhitespaces", "number", true );
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
				},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				if ( node.type === "ArrayExpression" && node.elements && node.elements.length ) {

					this.sniffFirst( rule, node );

					// Checking preceding for each element
					node.elements.forEach(function( el, i ){
						var tokenIt;
						if ( node.elements[ i - 1 ] && node.elements[ i + 1 ] ) {
							tokenIt = tokenIterator
								.findByLeftPos( el.range[ 0 ] )
								.findGroupOpener( node.range[ 0 ] );
							// [< >element<, >element ]
							// incl. [(((el)))]
							mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ), rule.allowElementPrecedingWhitespaces,
								"ArraylElementPrecedingSpacing" );
						}
					});
					// Checking trailing for the last element
					// [ element, element< >]
					this.sniffLast( rule, node );
				}
			},

		/**
			* Check the first element
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffFirst: function( rule, node ) {
				var el, expected, tokenIt;

				if ( !node.elements.length ) {
					return;
				}

				el = node.elements[ 0 ];

				// Checking preceding space for the first element
				// {< >element, element }

				expected = rule.allowElementPrecedingWhitespaces;

				if ( rule.exceptions && rule.exceptions.firstArg &&
					rule.exceptions.firstArg[ "for" ].indexOf( el.type ) !== -1 ) {
					expected = rule.exceptions.firstArg.allowElementPrecedingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleArg && node.elements.length === 1 &&
					rule.exceptions.singleArg[ "for" ].indexOf( el.type ) !== -1 ) {
					expected = rule.exceptions.singleArg.allowElementPrecedingWhitespaces;
				}

				// find element token in the interator
				tokenIt = tokenIterator
					.findByLeftPos( el.range[ 0 ] )
					.findGroupOpener( node.range[ 0 ] );

				// between prev. token right pos and el left pos
				mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
					expected, "ArraylElementPrecedingSpacing" );
			},


			/**
			* Check the last element
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffLast: function( rule, node ) {
				var el, expected, tokenIt;
				if ( !node.elements.length ) {
					return;
				}

				el = node.elements[ node.elements.length - 1 ];

				// Checking preceding for the last element
				// arr[ el,< >el ]
				// also: arr[ el,< >(((el))) ]
				// For the first another sniff take care
				if ( node.elements.length > 1 ) {

					// find element token in the interator
					tokenIt = tokenIterator
						.findByLeftPos( el.range[ 0 ] )
						.findGroupOpener( node.range[ 1 ] );

					mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
						rule.allowElementPrecedingWhitespaces, "ArraylElementPrecedingSpacing" );
				}

				// Checking trailing for the last element
				// [ el, el< >]
				expected = rule.allowElementTrailingWhitespaces;

				if ( rule.exceptions && rule.exceptions.lastArg &&
					rule.exceptions.lastArg[ "for"  ].indexOf( el.type ) !== -1 ) {
					expected = rule.exceptions.lastArg.allowElementTrailingWhitespaces;
				}

				if ( rule.exceptions && rule.exceptions.singleArg && node.elements.length === 1 &&
						rule.exceptions.singleArg[ "for" ].indexOf( el.type ) !== -1 ) {
						expected = rule.exceptions.singleArg.allowElementTrailingWhitespaces;
				}
				// find element token in the interator
				tokenIt = tokenIterator
						.findByRightPos( el.range[ 1 ] )
						.findGroupOpener( node.range[ 1 ] );

				// find next token: foo( el, el<>)
				// also: foo( el, (((el)))< >)
				mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ), expected, "ArraylElementTrailingSpacing" );
			}
		};
	};
	return Sniff;
});