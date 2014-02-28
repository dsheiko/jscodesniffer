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
* @module lib/Sniff/SyntaxTree/VariableDeclarationPerScopeConventions
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
		NAME = "VariableDeclarationPerScopeConventions",
		compoundStatements = [
			"IfStatement",
			"WhileStatement",
			"DoWhileStatement",
			"ForStatement",
			"ForInStatement",
			"WithStatement",
			"TryStatement"
		],
	/**
	* @constructor
	* @alias module:lib/Sniff/SyntaxTree/VariableDeclarationPerScopeConventions
	* @param {module:lib/SourceCode} sourceCode
	* @param {module:lib/Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
		var matches = 0;
		/** @lends module:lib/Sniff/SyntaxTree/VariableDeclarationPerScopeConventions.prototype */
		return {
			/**
			* Check the contract
			* @access public
			* @param {Object} rule
			*/
			validateRule: function( rule ) {
				utils.validateRule( rule, "disallowMultiplePerBlockScope", "boolean" );
				rule.hasOwnProperty( "requireInTheBeginning" ) && utils.validateRule( rule, "requireInTheBeginning", "boolean" );
			},
			/**
			* Run the sniffer according a given rule if a given node type matches the case
			* @access public
			* @param {Object} rule
			* @param {Object} node
			*/
			run: function( rule, node ) {
				var that = this,
						cb = function( body ){
							if ( rule.hasOwnProperty( "requireInTheBeginning" ) && rule.requireInTheBeginning ) {
								body.length && that.sniffToBeFirst( body );
							}
						};
				matches = 0;

				if ( !rule.disallowMultiplePerBlockScope ) {
					return;
				}
				if ( node.type !== "Program" && node.type !== "FunctionExpression" && node.type !== "FunctionDeclaration" ) {
					return;
				}
				if ( node.type === "Program" ) {
					this.sniffPerScope( rule, node, cb );
				}
				if ( node.body && node.body.type && node.body.type === "BlockStatement" && node.body.body ) {
					this.sniffPerScope( rule, node, cb );
				}
			},
			/**
			* Sniff if the var statement placed in the beginning of the scope
			* @access protected
			* @param {Object[]} scope
			*/
			sniffToBeFirst: function( scope ) {
				var
					// "use strict"; is an exception
					index = ( scope[ 0 ].type === "ExpressionStatement" && scope[ 0 ].expression.type === "Literal" ) ? 1 : 0;
				// If the block scope has no var declaration, irnore
				if ( scope.filter(function( node ){
					return node.type === "VariableDeclaration";
				}).length	=== 0 ) {
					return;
				}
				if ( scope[ index ].type !== "VariableDeclaration" ) {
					this.sniff( scope[ index ], 0, 0, "RequireVarDeclarationInTheBeginning" );
				}
			},

			/**
			* Check node down recursevely and report to mediator if violation of a given rule found
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			* @param {function} fn callback
			*/
			sniffPerScope: function( rule, node, fn ) {
				var that = this,
					scope;

				scope = node.type === "Program" ? node : node.body;
				scope = !scope && node.consequent ? node.consequent.body : scope;
				scope = !scope && node.block ? node.block.body : scope;

				scope && Array.isArray( scope.body ) && fn( scope.body );

				scope && Array.isArray( scope.body ) && scope.body.forEach(function( el ){
					if ( el.type === "VariableDeclaration" ) {
						matches++;
						if ( matches > 1 ) {
							that.sniff( el, matches, 1, "MultipleVarDeclarationPerBlockScope" );
						}
					}
					// Go deeper if a compound statement. That's is still the same scope
					if ( compoundStatements.indexOf( el.type ) !== -1 ) {
						that.sniffPerScope( rule, el, fn );
					}
				});
			},


			/**
			* Report to the mediator if `actual` doesn't match `expected`
			*
			* @access protected
			* @param {Object} node
			* @param {number} actual
			* @param {number} expected
			* @param {string} errorCode
			*/
			sniff: function( node, actual, expected, errorCode ) {
				mediator.publish( "violation", NAME, errorCode, node.range, node.loc, {
					actual: actual,
					expected: expected,
					excerpt: sourceCode.extract( node.range[ 0 ], node.range[ 1 ] ).get(),
					trace: ".." + sourceCode
						.extract( node.range[ 0 ] - 1, node.range[ 1 ] + 1 )
						.get() + "..",
					where: ""
				});
			}

		};
	};
	return Sniff;
});