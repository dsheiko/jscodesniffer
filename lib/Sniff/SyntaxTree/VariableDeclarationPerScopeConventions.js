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
	* @module Sniff/SyntaxTree/VariableDeclarationPerScopeConventions
	* @param {function} require
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
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
	* @alias module:Sniff/SyntaxTree/VariableDeclarationPerScopeConventions
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
		var matches = 0;
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
				matches = 0;
				if ( !rule.disallowMultiplePerBlockScope ) {
					return;
				}
				if ( node.type !== "FunctionExpression" && node.type !== "FunctionDeclaration" ) {
					return;
				}
				if ( !node.body || !node.body.type || node.body.type !== "BlockStatement" || !node.body.body ) {
					return;
				}
				this.sniffPerScope( rule, node );
				if ( rule.hasOwnProperty( "requireInTheBeginning" ) && rule.requireInTheBeginning && matches ) {
					this.sniffToBeFirst( node.body );
				}
			},
			/**
			* Sniff if the var statement placed in the beginning of the scope
			* @access protected
			* @param {Object} scopeNode
			*/
			sniffToBeFirst: function( scopeNode ) {
				var scope = scopeNode.body || scopeNode.consequent.body || scopeNode.block.body,
					// "use strict"; is an exception
					index = ( scope[ 0 ].type === "ExpressionStatement" && scope[ 0 ].expression.type === "Literal" ) ? 1 : 0;
				if ( scope[ index ].type !== "VariableDeclaration" ) {
					this.sniff( scope[ index ], 0, 0, "RequireVarDeclarationInTheBeginning" );
				}
			},

			/**
			* Check node down recursevely and report to mediator if violation of a given rule found
			* @access protected
			* @param {Object} rule
			* @param {Object} node
			*/
			sniffPerScope: function( rule, node ) {
				var that = this,
					scope;

				scope = node.body;
				scope = !scope && node.consequent ? node.consequent.body : scope;
				scope = !scope && node.block ? node.block.body : scope;

				scope && Array.isArray( scope.body ) && scope.body.forEach(function( el ){
				if ( el.type === "VariableDeclaration" ) {
					matches++;
					if ( matches > 1 ) {
					that.sniff( el, matches, 1, "MultipleVarDeclarationPerBlockScope" );
					}
				}
				// Go deeper if a compound statement. That's is still the same scope
				if ( compoundStatements.indexOf( el.type ) !== -1 ) {
					that.sniffPerScope( rule, el );
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
					expected: expected
				});
			}

		};
	};
	return Sniff;
});