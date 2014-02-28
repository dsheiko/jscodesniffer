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
* @module lib/Sniff/SyntaxTree/ObjectLiteralSpacing
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
		NAME = "ObjectLiteralSpacing",
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/ObjectLiteralSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	* @param {module:lib/TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		/**
		* @type {Mixin}
		*/
		var mixin = utils.Mixin( sourceCode, mediator, NAME );
		/** @lends module:lib/Sniff/SyntaxTree/ObjectLiteralSpacing.prototype */
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
				var tokenIt,
						leftBoundary,
						rightBoundary,
						last;

				// a = { prop: 1 }
				if ( node.type === "ObjectExpression" && node.properties.length ) {

					leftBoundary = node.range[ 0 ];
					rightBoundary = node.range[ 1 ];

					// Checking preceding for each property
					node.properties.forEach(function( prop ){
						var tokenIt;

						// {< >key: value<, >key: value }
						tokenIt = tokenIterator
							.findByLeftPos( prop.key.range[ 0 ] )
							.findGroupOpener( leftBoundary );

						mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
							rule.allowKeyPrecedingWhitespaces, "ObjectPropertyKeyPrecedingSpacing", "<" );

						// { key<>: value, key<>: value }
						tokenIt = tokenIterator
							.findByRightPos( prop.key.range[ 1 ] )
							.findGroupCloser( rightBoundary );

						mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
							rule.allowKeyTrailingWhitespaces, "ObjectPropertyKeyTrailingSpacing", ">" );

						// { key:< >value, key:< >value }
						tokenIt = tokenIterator
							.findByLeftPos( prop.value.range[ 0 ] )
							.findGroupOpener( leftBoundary );

						if ( prop.value.type !== "NewExpression" ) {
							mixin.sniffExcerpt( tokenIt.get( -1 ), tokenIt.get( 0 ),
								rule.allowValuePrecedingWhitespaces, "ObjectPropertyValuePrecedingSpacing", "<" );
						}
					});


					// Checking trailing for the last property
					// { key: value, key: value< >}
					last = node.properties[ node.properties.length - 1 ].value;
					// Unsafe for mutiline values
					if ( sourceCode.extract( last.range[ 0 ], last.range[ 1 ] ).find( "\n" ) !== -1 ) {
						return;
					}
					tokenIt = tokenIterator
						.findByRightPos( last.range[ 1 ] )
						.findGroupCloser( rightBoundary );

					mixin.sniffExcerpt( tokenIt.get( 0 ), tokenIt.get( 1 ),
						rule.allowValueTrailingWhitespaces, "ObjectPropertyValueTrailingSpacing", ">" );
				}
			}
		};
	};
	return Sniff;
});