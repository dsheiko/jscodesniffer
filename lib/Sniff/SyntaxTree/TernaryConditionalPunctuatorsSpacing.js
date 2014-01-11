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
	* @module Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing
	*/
define(function ( require ) {

var utils = require( "../Utils" ),
	NAME = "TernaryConditionalPunctuatorsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing
	*/
	SniffClass = function( sourceCode, mediator ) {
	return {
	/**
		* Check contract
		* @param {Object} rule
		*/
		validateRule: function( rule ) {
		utils.validateRule( rule, "allowTestTrailingWhitespaces", "number" );
		utils.validateRule( rule, "allowConsequentPrecedingWhitespaces", "number" );
		utils.validateRule( rule, "allowConsequentTrailingWhitespaces", "number" );
		utils.validateRule( rule, "allowAlternatePrecedingWhitespaces", "number" );
		},
	/**
		* Run the sniffer according a given rule if a given node type matches the case
		* @param {Object} rule
		* @param {Object} node
		*/
	run: function( rule, node ) {
		var context,
			qMarkPos,
			sMarkPos;

		if ( node.type === "ConditionalExpression" && node.test && node.consequent && node.alternate ) {

			// Ignore for nesting if the corresponding ruleset is disabled
			if ( rule.ifNesting === false && node.isNesting ) {
				return;
			}

			context = sourceCode.extract( node.range[ 0 ], node.range[ 1 ] );
			qMarkPos = node.range[ 0 ] + context.find( "?" );
			sMarkPos = node.range[ 0 ] + context.find( ":" );

			// test< >? consequent : alternate
			this.isTokenSafe( node.test ) && this.sniff( node.test, node.test.range[ 1 ],
				qMarkPos, rule.allowTestTrailingWhitespaces, "TernaryConditionalTestTrailingWhitespaces" );

			// test ?< >consequent : alternate
			this.isTokenSafe( node.consequent ) && this.sniff( node.consequent, qMarkPos + 1,
				node.consequent.range[ 0 ], rule.allowConsequentPrecedingWhitespaces,
				"TernaryConditionalConsequentPrecedingWhitespaces" );

			// test ? consequent< >: alternate
			this.isTokenSafe( node.consequent ) && this.sniff( node.consequent, node.consequent.range[ 1 ],
				sMarkPos, rule.allowConsequentTrailingWhitespaces, "TernaryConditionalConsequentTrailingWhitespaces" );

			// test ? consequent :< >alternate
			this.isTokenSafe( node.alternate ) && this.sniff( node.alternate, sMarkPos + 1,
				node.alternate.range[ 0 ], rule.allowAlternatePrecedingWhitespaces,
				"TernaryConditionalAlternatePrecedingWhitespaces" );

		}
	},
	/**
	* @TODO: consider all the other cases
	* Test if a given token is safe to make assertion. E.g. when it's ConditionalExpression, the implemented
	* method won't find spaces correctly
	*
	* @param {Object} node
	* @returns {Boolean}
	*/
	isTokenSafe: function( node ) {
		return node.type && [ "Identifier", "Literal" ].indexOf( node.type ) !== -1;
	},


	/**
		* Sniff a given range
		*
		* @param {Object} node
		* @param {number} lPos
		* @param {number} rPos
		* @param {number} expected
		* @param {string} errorCode
		*/
		sniff: function( node, lPos, rPos, expected, errorCode ) {
		var fragment = sourceCode.extract( lPos, rPos );
		if ( fragment.find( "\n" ) === -1 ) {
			if ( fragment.length() !== expected ) {
			mediator.publish( "violation", NAME, errorCode, [ lPos, rPos ], {
				start: node.loc.start,
				end: {
				line: node.loc.start.line,
				column: node.loc.start.column + ( rPos - lPos )
				}
			}, {
				actual: fragment.length(),
				expected: expected
			});
			}
		}
		}

	};
};
	return SniffClass;
});