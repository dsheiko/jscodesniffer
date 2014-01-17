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
	* @module Sniff/SyntaxTree/NewExpressionCalleeNamingConventions
	* @param {function} require
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
		NAME = "NewExpressionCalleeNamingConventions",
		/**
		*
		* @type {string[]}
		*/
		reservedWords = require( "../ReservedWords" );
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/NewExpressionCalleeNamingConventions
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	*/
	return function( sourceCode, mediator ) {
		return {
		/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "allowCase", "array", true );
				utils.validateRule( rule, "allowRepeating", "boolean", true );
				utils.validateRule( rule, "allowNumbers", "boolean", true );
			},
			/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} node
			*/
			run: function( rule, node ) {

				if ( node.type === "NewExpression" && node.callee &&
					node.callee.type === "Identifier" ) {
					// Ignore case: a reserved word
					if ( node.callee.name && reservedWords.indexOf( node.callee.name ) !== -1 ) {
						return;
					}
					this.sniffCase( rule.allowCase, node.callee );
					this.sniffRepeatingUc( rule.allowRepeating, node.callee );
					this.sniffNumbers( rule.allowNumbers, node.callee );
				}
			},
			/**
			* Report to the mediator if name contained in a given node doesn't match specified case (camel, pascal)
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffCase: function( rule, node ) {
				var code = "NewExpressionCalleeNamingConventions",
					isValid = false,
					reCase = {
					camel: /^[\$_]*[a-z][a-zA-Z0-9]*$/g,
					pascal: /^[\$_]*[A-Z][a-zA-Z0-9]*$/g
					};

				if ( node.type === "Identifier"  ) {
					rule.forEach(function( nCase ){
						if ( reCase.hasOwnProperty( nCase ) ) {
							isValid = isValid || reCase[ nCase ].test( node.name );
						}
					});
					if ( !isValid ) {
						mediator.publish( "violation", NAME, code, node.range, node.loc, {
							actual: node.name,
							expected: rule.join( " or " )
						});
					}
				}
			},

			/**
			* Report to the mediator if name contained in a given node doesn't match specified
			* `repeating uppercaser` convention
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffRepeatingUc: function( rule, node ) {
				var code = "NewExpressionNamingRepeatingUppercase",
					reRepeatingUc = /[A-Z]+/g;
				if ( node.type === "Identifier"  ) {
					if ( !rule && reRepeatingUc.test( node.name ) ) {
						mediator.publish( "violation", NAME, code, node.range, node.loc );
					}
				}
			},

			/**
			* Report to the mediator if name contained in a given node doesn't match specified `numbers in name allowed`
			* convention
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffNumbers: function( rule, node ) {
				var code = "NewExpressionNamingNumbersNotAllowed",
					reNumbers = /[0-9]/g;
				if ( node.type === "Identifier"  ) {
					if ( !rule && reNumbers.test( node.name ) ) {
						mediator.publish( "violation", NAME, code, node.range, node.loc );
					}
				}
			}

		};
	};
});