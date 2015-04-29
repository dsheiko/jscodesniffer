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
* @module lib/Sniff/SyntaxTree/EmptyConstructsSpacing
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
define(function ( require ) {

		/**
		* @type {utilsSniff/Utils}
		*/
var utils = require( "../Utils" ),
		/**
		* @constant
		* @type {String}
		* @default
		*/
		NAME = "EmptyConstructsSpacing",
		RE_COMMENT = "\\/\\*.*?\\*\\/",
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/EmptyConstructsSpacing
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
		/** @lends module:lib/Sniff/SyntaxTree/EmptyConstructsSpacing.prototype */
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "for", "array", true );
				utils.validateRule( rule, "allowWhitespaces", "boolean", true );
			},
			/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} node
			*/
			run: function( rule, node ) {
				var actual;
				if ( rule.allowWhitespaces ) {
					return;
				}

				if ( rule[ "for" ].indexOf( "ObjectExpression" ) !== -1 && node.type === "ObjectExpression" &&
					node.hasOwnProperty( "properties" ) && !node.properties.length ) {
					// var obj = { };
					actual = sourceCode
						.extract( node.range[ 0 ], node.range[ 1 ] )
						.filter( "[\\{\\}]" )
						.filter( RE_COMMENT );
					// Ignore when contains inline comments
					this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
				}
				if ( rule[ "for" ].indexOf( "ArrayExpression" ) !== -1 && node.type === "ArrayExpression" &&
					node.hasOwnProperty( "elements" ) && !node.elements.length ) {
					// var arr = [ ];
					actual = sourceCode
						.extract( node.range[ 0 ], node.range[ 1 ] )
						.filter( "[\\[\\]]" )
						.filter( RE_COMMENT );
					// Ignore when contains inline comments
					this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
				}

				if ( rule[ "for" ].indexOf( "FunctionDeclaration" ) !== -1 && node.type === "FunctionDeclaration" &&
					node.hasOwnProperty( "params" ) && !node.params.length ) {
					// function fn<( )>{}
					actual = sourceCode
						.extract( node.id.range[ 1 ], node.body.range[ 0 ] )
						.filter( "\\s+$" ) // remove spaces between ')' and '{'
						.filter( "[\\(\\)\\}\\{]" )
						.filter( RE_COMMENT );
					// Ignore when contains inline comments
					this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
				}

				if ( rule[ "for" ].indexOf( "FunctionExpression" ) !== -1 && node.type === "FunctionExpression" &&
					node.hasOwnProperty( "params" ) && !node.params.length ) {
					// var fn = function(< >){}
					actual = sourceCode
						.extract( node.range[ 0 ] + 8, node.body.range[ 0 ] )
						.filter( "\\s+$" ) // remove spaces between ')' and '{'
						.filter( "[\\(\\)\\}\\{]" )
						.filter( RE_COMMENT );
					// Ignore when contains inline comments
					this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
				}

				if ( rule[ "for" ].indexOf( "CallExpression" ) !== -1 && node.type === "CallExpression" &&
					node.hasOwnProperty( "arguments" ) && !node[ "arguments" ].length && node.callee ) {
					// fn(< >);
					actual = sourceCode
						.extract( node.range[ 0 ] +
							( node.callee.range[ 1 ] - node.callee.range[ 0 ] ), node.range[ 1 ] )
						.filter( "[\\(\\)\\}\\{]" )
						.filter( RE_COMMENT );
					// Ignore when contains inline comments
					this.hasComments( actual ) && this.sniff( actual.length(), node.range, node.loc );
				}
			},
			/**
				* Check a given code has comments
				* @access protected
				* @param {object} srcCode
				* @returns {Boolean}
				*/
			hasComments: function( srcCode ) {
				return srcCode.find( "//" ) === -1 && srcCode.find( "/*" ) === -1;
			},

			/**
			* @typedef Loc
			* @type {object}
			* @property {{line: number, column: number}} start
			* @property {{line: number, column: number}} end
			*/

			/**
			* Report to the mediator if actual is not `0`
			* @param {number} actual
			* @param {Object} range
			* @param {Loc} loc
			*/
			sniff: function( actual, range, loc ) {
				var code = "EmptyConstructsSpacing",
						excerpt = sourceCode.extract( range[ 0 ], range[ 1 ] );
					if ( actual !== 0 ) {
						mediator.publish( "violation", NAME, code, range, loc, {
							actual: actual,
							expected: 0,
							excerpt: excerpt.get(),
							trace: ".." + sourceCode.extract( range[ 0 ] - 1, range[ 1 ] + 1 ).get() + "..",
							where: ""
						});
					}
			}
		};
	};
	return Sniff;
});