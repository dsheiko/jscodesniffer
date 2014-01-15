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
	* @module Sniff/SyntaxTree/UnaryExpressionIdentifierSpacing
	* @param {function} require
	*/
define(function( require ) {
"use strict";

var utils = require( "../Utils" ),
	NAME = "UnaryExpressionIdentifierSpacing",
	IGNORE_OPERATORS = [ "delete", "in", "instanceof", "new", "this", "typeof", "void" ],
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/UnaryExpressionIdentifierSpacing
	* @param {SourceCode} sourceCode
	* @param {Mediator} mediator
	*/
	Sniff = function( sourceCode, mediator ) {
	return {
		/**
		* Check the contract
		* @access public
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
			utils.validateRule( rule, "allowTrailingWhitespaces", "number", true );
		},
		/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @access public
		* @param {Object} rule
		* @param {Object} node
		*/
		run: function( rule, node ) {
			var inBetween, precedingSpaces;
			if ( node.type === "UnaryExpression" && node.operator && IGNORE_OPERATORS.indexOf( node.operator ) === -1 ) {
				inBetween = sourceCode.extract( node.range[ 0 ] + node.operator.length, node.argument.range[ 0 ] );
				precedingSpaces = inBetween.length() - inBetween.filter( "^ +" ).length();
				this.sniff( node.argument, node, precedingSpaces, rule.allowTrailingWhitespaces, inBetween.get() );
			}
		},
		/**
		* Report to the mediator if the fragment between lPos and rPos doesn't match expected
		* if it's not multiline
		*
		* @access protected
		* @param {Object} arg
		* @param {Object} node
		* @param {number} actual
		* @param {number} expected
		* @param {string} trace
		*/
		sniff: function( arg, node, actual, expected, trace ) {
			var code = "UnaryExpressionValueTrailingSpacing";
			if ( actual !== expected ) {
				mediator.publish( "violation", NAME, code, [
						node.range[ 0 ],
						arg.range[ 0 ]
					], {
						start: node.loc.start,
						end: arg.loc.start
					}, {
						actual: actual,
						expected: expected,
						trace: trace
				});
			}
		}
	};
};
	return Sniff;
});