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
	* @module Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing
	* @param {function} require
	*/
define(function( require ) {

var utils = require( "../Utils" ),
	NAME = "TernaryConditionalPunctuatorsSpacing",
	/**
	* @constructor
	* @alias module:Sniff/SyntaxTree/TernaryConditionalPunctuatorsSpacing
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
				utils.validateRule( rule, "allowTestTrailingWhitespaces", "number" );
				utils.validateRule( rule, "allowConsequentPrecedingWhitespaces", "number" );
				utils.validateRule( rule, "allowConsequentTrailingWhitespaces", "number" );
				utils.validateRule( rule, "allowAlternatePrecedingWhitespaces", "number" );
			},
			/**
				* Run the sniffer according a given rule if a given node type matches the case
				* @access public
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
						// Override rules when nesting and corresponding rules defined
					if ( rule.ifNesting && node.isNesting ) {
						rule = rule.ifNesting;
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
			* @access protected
			* @param {Object} node
			* @returns {Boolean}
			*/
			isTokenSafe: function( node ) {
				return node.type && [ "Identifier", "Literal" ].indexOf( node.type ) !== -1;
			},


			/**
			* Report to the mediator if the fragment between lPos and rPos doesn't match expected
			* if it's not multiline
			*
			* @access protected
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
	return Sniff;
});