/*
	* @package jscodesniffer
	* @author sheiko
	* @license MIT
	* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
	* @jscs standard:Jquery
	* jshint unused:false
	* Code style: http://docs.jquery.com/JQuery_Core_Style_Guidelines
	*/

// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
/**
	* A module representing a sniffer.
	* @module Sniff/SyntaxTree/FunctionNamingConventions
	*/
define(function ( require ) {

var utils = require( "../Utils" ),
		reservedWords = require( "../ReservedWords" ),
	NAME = "FunctionNamingConventions";
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/FunctionNamingConventions
	*/
return function( sourceCode, mediator ) {
		return {
		/**
			* Check contract
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
			utils.validateRule( rule, "allowCase", "array", true );
			utils.validateRule( rule, "allowRepeating", "boolean", true );
			utils.validateRule( rule, "allowNumbers", "boolean", true );
			},
		/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @param {Object} rule
			* @param {Object} node
			*/
		run: function( rule, node ) {

			if ( node.type === "AssignmentExpression" && node.right &&
				node.right.type === "FunctionExpression" ) {
				// Ignore case: a reserved word
				if ( node.left.name && reservedWords.indexOf( node.left.name ) !== -1 ) {
					return;
				}
				this.sniffCase( rule.allowCase, node.left );
				this.sniffRepeatingUc( rule.allowRepeating, node.left );
				this.sniffNumbers( rule.allowNumbers, node.left );
			}
			if ( node.type === "FunctionDeclaration" ) {
				// Ignore case: a reserved word
				if ( node.id.name && reservedWords.indexOf( node.id.name ) !== -1 ) {
					return;
				}
				this.sniffCase( rule.allowCase, node.id );
				this.sniffRepeatingUc( rule.allowRepeating, node.id );
				this.sniffNumbers( rule.allowNumbers, node.id );
			}
			if ( node.type === "VariableDeclarator" && node.init &&
				node.init.type === "FunctionExpression" ) {
				// Ignore case: a reserved word
				if ( node.id.name && reservedWords.indexOf( node.id.name ) !== -1 ) {
					return;
				}
				this.sniffCase( rule.allowCase, node.id, node.id );
				this.sniffRepeatingUc( rule.allowRepeating, node.id );
				this.sniffNumbers( rule.allowNumbers, node.id );
			}

		},
		/**
			*
			* @param {Array} rule
			* @param {Object} node
			*/
		sniffCase: function( rule, node ) {
			var code = "FunctionNamingConventions",
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
			*
			* @param {Object} rule
			* @param {Object} node
			*/
		sniffRepeatingUc: function( rule, node ) {
			var code = "FunctionNamingRepeatingUppercase",
				reRepeatingUc = /[A-Z]+/g;
			if ( node.type === "Identifier"  ) {
			if ( !rule && reRepeatingUc.test( node.name ) ) {
				mediator.publish( "violation", NAME, code, node.range, node.loc );
			}
			}
		},

			/**
			*
			* @param {Object} rule
			* @param {Object} node
			*/
		sniffNumbers: function( rule, node ) {
			var code = "FunctionNamingNumbersNotAllowed",
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