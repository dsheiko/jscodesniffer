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
	* @module Sniff/SyntaxTree/VariableNamingConventions
	* @param {function} require
	*/
define(function ( require ) {

var utils = require( "../Utils" ),
		reservedWords = require( "../ReservedWords" ),
	NAME = "VariableNamingConventions";
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/VariableNamingConventions
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
				* @param {Object} parentNode
				*/
			run: function( rule, node, parentNode ) {

				// Ignore reserved like window.XMLHttpRequest
				if ( parentNode.type && parentNode.type === "MemberExpression" ) {
					return;
				}
				// Ignore case: foo = function(){};
				if ( parentNode.type && parentNode.type === "AssignmentExpression" && parentNode.right &&
					parentNode.right.type === "FunctionExpression" ) {
					return;
				}

				// Ignore case: return Cli;
				if ( parentNode.type && parentNode.type === "ReturnStatement" ) {
					return;
				}

				// Ignore case: function foo() {}
				if ( parentNode.type && parentNode.type === "FunctionDeclaration" ) {
					return;
				}
				// Ignore case: var logger = new Logger();
				if ( parentNode.type && parentNode.type === "NewExpression" ) {
					return;
				}

				// Ignore case: { prop: function(){} }
				if ( parentNode.value && parentNode.value.type === "FunctionExpression" ) {
					return;
				}

				if ( parentNode.type && parentNode.type === "VariableDeclarator" && parentNode.init &&
					// Ignore case: var SourceCode = function(){};
					( parentNode.init.type === "FunctionExpression" ||
					// Ignore case: var SourceCode = require( "./SourceCode" )
					parentNode.init.type === "CallExpression" ) ) {
					return;
				}
				// Ignore case: a reserved word
				if ( node.name && reservedWords.indexOf( node.name ) !== -1 ) {
					return;
				}

				if ( node.type === "Identifier" && !this.isConstant( node.name ) ) {
					this.sniffCase( rule.allowCase, node );
					this.sniffRepeatingUc( rule.allowRepeating, node );
					this.sniffNumbers( rule.allowNumbers, node );
				}
			},
			/**
			* Check if it is a constant
			* @access protected
			* @param {string} text
			* @returns {boolean}
			*/
			isConstant: function( text ) {
				var reAllUpperCase = /^[\$_]?[A-Z0-9_]*$/g;
				return reAllUpperCase.test( text );
			},
			/**
			* Report to the mediator if name contained in a given node doesn't match specified case (camel, pascal)
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffCase: function( rule, node ) {
				var reCase = {
					camel: /^[\$_]*[a-z][a-zA-Z0-9]*[\$_]*$/g,
					pascal: /^[\$_]*[A-Z][a-zA-Z0-9]*[\$_]*$/g
					},
					reAllLowerCase = /^[a-z]+$/g,
					isChainValid = false,
					val;
				if ( node.type === "Identifier"  ) {
					val = node.name;
					if ( reAllLowerCase.test( val ) ) {
						return;
					}

					rule.forEach(function( nCase ){
						var isValid;
						if ( reCase.hasOwnProperty( nCase ) ) {
							isValid = reCase[ nCase ].test( val );
							isChainValid = isChainValid || isValid;
						}
					});
					if ( !isChainValid ) {
						mediator.publish( "violation", NAME, "VariableNamingConventions", node.range, node.loc, {
							actual: val,
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
				var reAllLowerCase = /^[a-z]+$/g,
					reRepeatingUc = /[A-Z]+/g,
					val;
				if ( node.type === "Identifier"  ) {
					val = node.name;
					if ( reAllLowerCase.test( val ) ) {
						return;
					}
					if ( !rule && reRepeatingUc.test( val ) ) {
						mediator.publish( "violation", NAME, "VariableNamingRepeatingUppercase", node.range, node.loc, {
						actual: val,
						expected: ""
						});
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
				var reNumbers = /[0-9]/g,
					val;
				if ( node.type === "Identifier"  ) {
					val = node.name;
					if ( !rule && reNumbers.test( val ) ) {
						mediator.publish( "violation", NAME, "VariableNamingNumbersNotAllowed", node.range, node.loc, {
							actual: val,
							expected: ""
						});
					}
				}
			}
		};
	};
});