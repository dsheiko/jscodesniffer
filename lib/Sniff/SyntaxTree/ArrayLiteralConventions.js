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
	* @module Sniff/SyntaxTree/ObjectLiteralConventions
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
		NAME = "ArrayLiteralConventions",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/ObjectLiteralConventions
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	* @param {TokenIterator} tokenIterator
	*/
	Sniff = function( sourceCode, mediator, tokenIterator ) {
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "requireOnePerLineWhenMultiline", "boolean", true );
			},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
				* @param {Object} rule
				* @param {Object} node
				*/
			run: function( rule, node ) {
				var that = this,
						leftSibling,
						/**
						*
						* @type {Object[]}
						*/
						sameLineEls = [];

				// a = { prop: 1 }
				if ( rule.requireOnePerLineWhenMultiline && node.type === "ArrayExpression" &&
					node.elements.length ) {

					// Checking preceding for each property
					sameLineEls = node.elements.filter(function( el ){
						var tokenIt;

						// {< >element, < >element }
						tokenIt = tokenIterator
							.findByLeftPos( el.range[ 0 ] );

						leftSibling = tokenIt.get( -1 );
						if ( leftSibling.type === "Puntuator" && leftSibling.value === "," ) {
							leftSibling = tokenIt.get( -2 );
						}
						return that.isSameNewLine( leftSibling, tokenIt );
					});

					if ( sameLineEls.length !== node.elements.length ) {
						sameLineEls.forEach(function( prop ){
							var excerpt = sourceCode.extract( prop.range[ 0 ], prop.range[ 1 ] );
							mediator.publish( "violation", NAME, "ArrayDeclarationRequireOnePerLineWhenMultiline",
								prop.range, prop.loc, {
									excerpt: excerpt.get(),
									trace: ".." + excerpt.get() + ".."
								});
						});
					}

				}
			},
			/**
			*
			* @param {Object} leftSibling
			* @param {TokenIterator} tokenIt
			* @returns {Boolean}
			*/
			isSameNewLine: function( leftSibling, tokenIt ) {
				return sourceCode.extract( leftSibling.range[ 1 ], tokenIt.get( 0 ).range[ 0 ] ).find( "\n" ) === -1;
			}
		};
	};
	return Sniff;
});


